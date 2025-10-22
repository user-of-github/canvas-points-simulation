import { type Dimension } from './pure-javascipt/types';


export class CanvasRenderer {
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

    public render(data: Float32Array, pointsAmount: number, {width, height}: Dimension): void {
        this.context.fillStyle = 'white';
        this.context.strokeStyle = 'white';

        if (width !== this.canvasRef.width || height !== this.canvasRef.height) {
            this.canvasRef.width = width;
            this.canvasRef.height = height;
            this.context.translate(width, height);
            this.context.fillStyle = 'white';
        }

        this.context.clearRect(
            0,
            0,
            width,
            height
        );
        

        this.context.beginPath();

        for (let pointer = 0; pointer < pointsAmount * 4; pointer += 4) {
            this.context.rect(
                data[pointer + 0] - 1,
                data[pointer + 1] - 1,
                this.pointSize,
                this.pointSize
            );

            //console.log(data)
        }

        this.context.fill();
        this.context.stroke();
        //this.context.closePath();
    }

    public setPointSize(size: number) {
        this.pointSize = size;
    }
}