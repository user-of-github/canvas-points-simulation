import { Dimension, Renderer } from '../types';
import { Config } from '../config';
import VertGlslContent from './vert.glsl';
import FragGlslContent from './frag.glsl';


export class JavascriptCanvasRenderer implements Renderer {
    private readonly context: WebGLRenderingContext;

    public constructor(private readonly canvasRef: HTMLCanvasElement) {
        const ctx = this.canvasRef.getContext('webgl', { alpha: false, antialias: false });

        if (!ctx) {
            console.error('[App]: Can not get context from canvas ', canvasRef);
            throw Error();
        }

        this.context = ctx;
    }

    public async init(): Promise<void> {
        const gl = this.context;

        gl.bindBuffer(
            this.context.ARRAY_BUFFER,
            this.context.createBuffer()
        );

        gl.clearColor(0, 0, 0, 1);

        const program = gl.createProgram();

        this.loadCompileAttachShader(VertGlslContent, program);
        this.loadCompileAttachShader(FragGlslContent, program);

        gl.linkProgram(program);
        gl.useProgram(program);

        const attributeLocation = gl.getAttribLocation(program, 'coord');
        gl.enableVertexAttribArray(attributeLocation);
        // ниже -- описание того, как хранятся данные в моём Float32Array: 
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
    }

    private loadCompileAttachShader(content: string, program: WebGLProgram): void {
        const gl = this.context;

        const shader = gl.createShader(gl.VERTEX_SHADER);

        if (!shader) {
            console.error('[App]: Can not create shader ');
            throw new Error();
        }

        gl.shaderSource(shader, content);
        gl.compileShader(shader);
        console.log(gl.getShaderInfoLog(shader));

        gl.attachShader(program, shader);
    }

    public setPointSize(pointSize: number): void {

    };

    public render(data: Float32Array, pointsAmount: number, { width, height }: Dimension): void {

    };

    private fixCanvasSizeIfNecessary({ width, height }: Dimension) {
        if (width !== this.canvasRef.width || height !== this.canvasRef.height) {
            this.canvasRef.width = width;
            this.canvasRef.height = height;
            this.context.viewport(0, 0, width, height);
        }
    }
}

const a = new JavascriptCanvasRenderer(document.getElementById(Config.canvasElementId) as HTMLCanvasElement);
a.init();