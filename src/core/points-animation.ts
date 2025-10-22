import { Config } from './config';
import { Dimension, Renderer, type Physics } from './types';

export class PointsAnimation {
    

    private pointsCount: number = 0;
    private canvasSize: Dimension = { width: 0, height: 0};

    public constructor(
        private readonly physics: Physics, 
        private readonly renderer: Renderer,
        private readonly canvasElement: HTMLCanvasElement,
        private readonly pointsCountInput: HTMLInputElement,
        private readonly fpsOutput: HTMLElement,
        private readonly pointsSizeChangeInput: HTMLInputElement
    ) {
        this.validateHTML();
    }

    public startListening(): void {
        let lastTs = 0;
        let framesDrawn = 0;

        const frame = (timestamp: number = 0) => {
            window.requestAnimationFrame(frame);

            this.physics.tick(this.pointsCount);
            this.renderer.render(this.physics.data, this.pointsCount, this.canvasSize);

            ++framesDrawn;

            if (timestamp > lastTs + 2000) {
                this.fpsOutput.innerText = (1000 * framesDrawn / (timestamp - lastTs)).toFixed(2);
                lastTs = timestamp;
                framesDrawn = 0;
            }
        }

        frame();
    }

    public setupHandlers(): void {
        window.addEventListener('resize', this.handleWindowResize);
        this.handleWindowResize(); // initial assigment

        this.pointsCountInput.addEventListener('input', this.handleInput);
        this.handleInput(); // initial assigment
        
        this.canvasElement.addEventListener('click', this.handleClick);

        this.pointsSizeChangeInput.addEventListener('input', this.handlePointSizeChange)
    }

    private readonly handlePointSizeChange = (event: Event): void => {
        this.renderer.setPointSize(Number((event.currentTarget as HTMLInputElement ).value))
    }

    private readonly handleWindowResize = () => {
        this.canvasElement.width = this.canvasElement.clientWidth;
        this.canvasElement.height = this.canvasElement.clientHeight;

        this.canvasSize = {
            width: this.canvasElement.clientWidth, 
            height: this.canvasElement.clientHeight
        };
    };

    private readonly handleInput = () => {
        const parsed = Number(this.pointsCountInput.value);
        
        if (parsed > 1) {
            this.pointsCount = parsed;
        }
    }

    private readonly handleClick = (event: MouseEvent) => {
        debugger;
        const rect = this.canvasElement.getBoundingClientRect(); // Положение канваса
        const x = event.clientX - rect.left;  // Координата X клика относительно канваса
        const y = event.clientY - rect.top; 

        this.physics.run(x,y)
    };

    private validateHTML() {
        if (!this.canvasElement || !(this.canvasElement instanceof HTMLCanvasElement)) {
            console.error(`[App]: Canvas element not found. Add <canvas/> with #${Config.canvasElementId}`);
            throw new Error();
        }

        if (!this.pointsCountInput || !(this.pointsCountInput instanceof HTMLInputElement)) {
            console.error(`[App]: Input element not found. Add <input/> with #${Config.pointsCountInputId}`);
            throw new Error();
        }

        if (!this.fpsOutput || !(this.fpsOutput instanceof HTMLElement)) {
            console.error(`[App]: FPS output element not found. Add element with #${Config.pointsCountInputId}`);
            throw new Error();
        }
    }
}