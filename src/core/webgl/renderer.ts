import { Renderer } from '../types';
import VertGlslContent from './vert.glsl';
import FragGlslContent from './frag.glsl';


export class WebGLCanvasRenderer implements Renderer {
    private readonly context: WebGLRenderingContext;
    private readonly program: WebGLProgram;
    private pointSizeLocation: WebGLUniformLocation | null = null;


    public constructor(private readonly canvasRef: HTMLCanvasElement) {
        const ctx = this.canvasRef.getContext('webgl2', { alpha: false, antialias: false }) ||
            this.canvasRef.getContext('webgl', { alpha: false, antialias: false });

        if (!ctx) {
            console.error('[App]: Can not get context from canvas ', canvasRef);
            throw Error();
        }

        this.context = ctx;
        this.program = this.context.createProgram();

        this.init();
    }

    private init() {
        const gl = this.context;

        gl.bindBuffer(
            this.context.ARRAY_BUFFER,
            this.context.createBuffer()
        );

        gl.clearColor(0, 0, 0, 1);


        this.loadCompileAttachShader(VertGlslContent, gl.VERTEX_SHADER);
        this.loadCompileAttachShader(FragGlslContent, gl.FRAGMENT_SHADER);

        gl.linkProgram(this.program);
        gl.useProgram(this.program);

        this.pointSizeLocation = gl.getUniformLocation(this.program, 'pointSize');

        const attributeLocation = gl.getAttribLocation(this.program, 'coord');
        gl.enableVertexAttribArray(attributeLocation);
        // ниже -- описание того, как хранятся данные Float32Array: 
        //  [
        //      x, y, dx, dy
        //  ]
        gl.vertexAttribPointer(
            attributeLocation, // индекс атрибута
            2, // число компонент вектора - 2 - x, y
            gl.FLOAT, // тип данных float32
            false, // нормализация
            16, // расстояние в байтах между атрибутами
            0 // смещение начала массива
        );


        const width = this.canvasRef.clientWidth;
        const height = this.canvasRef.clientHeight

        gl.viewport(0, 0, width, height);
    }

    private loadCompileAttachShader(content: string, type: number): void {
        const gl = this.context;

        const shader = gl.createShader(type);

        if (!shader) {
            console.error('[App]: Can not create shader ');
            throw new Error();
        }

        gl.shaderSource(shader, content);
        gl.compileShader(shader);
        console.log(gl.getShaderInfoLog(shader));

        gl.attachShader(this.program, shader);
    }

    public setPointSize(pointSize: number): void {
        if (this.pointSizeLocation) {
            this.context.uniform1f(this.pointSizeLocation, pointSize);
        }
    };

    public render(data: Float32Array, pointsAmount: number): void {
        const gl = this.context;

        const attributeLocation = gl.getAttribLocation(this.program, 'scale');
        console.log(attributeLocation)
        gl.disableVertexAttribArray(attributeLocation);
        gl.vertexAttrib2f(
            attributeLocation,
            2 / this.canvasRef.width,
            -2 / this.canvasRef.height
        );

        gl.bufferData(
            gl.ARRAY_BUFFER,
            data.subarray(0, pointsAmount * 4),
            gl.DYNAMIC_DRAW
        );

        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.POINTS, 0, pointsAmount);

    };
}