import { type Renderer, type Dimension } from '../types';


export class JavascriptCanvasRenderer implements Renderer {
    private pointSize = 3;
    private readonly context: CanvasRenderingContext2D;
    public constructor(private readonly canvasRef: HTMLCanvasElement) {
        const ctx = canvasRef.getContext('2d');

        if (!ctx) {
            console.error('[App]: Can not get context from canvas ', canvasRef);
            throw Error();
        }

        this.context = ctx;
    }

    public async init(): Promise<void> {

    }

    private fixCanvasSizeIfNecessary({ width, height }: Dimension) {
        if (width !== this.canvasRef.width || height !== this.canvasRef.height) {
            this.canvasRef.width = width;
            this.canvasRef.height = height;
            //this.context.translate(width, height);
            this.context.fillStyle = 'white';
        }
    }

    public render(data: Float32Array, pointsAmount: number, size: Dimension): void {
        this.context.fillStyle = 'white';
        this.context.strokeStyle = 'white';

        this.fixCanvasSizeIfNecessary(size);

        this.context.clearRect(
            0,
            0,
            size.width,
            size.height
        );


        this.context.beginPath();

        for (let pointer = 0; pointer < pointsAmount * 4; pointer += 4) {
            this.context.rect(
                data[pointer + 0] - 1,
                data[pointer + 1] - 1,
                this.pointSize,
                this.pointSize
            );
        }

        this.context.fill();
        this.context.stroke();
        //this.context.closePath();
    }

    public setPointSize(size: number) {
        this.pointSize = size;
    }
}