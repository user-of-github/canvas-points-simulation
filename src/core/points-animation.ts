import { Config } from './config';
import { CanvasRenderingType, Coordinate, Dimension, Renderer, type Physics } from './types';


export class PointsAnimation {
    private pointsCount: number = 0;
    private canvasSize: Dimension = { width: 0, height: 0 };

    public constructor(
        private readonly physics: Physics,
        private readonly renderer: Renderer,
        private readonly renderingtType: CanvasRenderingType,
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
        this.canvasElement.width = this.canvasElement.clientWidth;
        this.canvasElement.height = this.canvasElement.clientHeight;
         this.canvasSize = {
            width: this.canvasElement.clientWidth,
            height: this.canvasElement.clientHeight
        };

        this.pointsCountInput.addEventListener('input', this.handleInput);
        this.handleInput(); // initial assigment

        this.canvasElement.addEventListener('click', this.handleClick);

        this.pointsSizeChangeInput.addEventListener('input', this.handlePointSizeChange);
        this.handlePointSizeChange();
    }

    private readonly handlePointSizeChange = (): void => {
        this.renderer.setPointSize(Number(this.pointsSizeChangeInput.value))
    }

    private readonly handleInput = () => {
        const parsed = Number(this.pointsCountInput.value);

        if (parsed >= 1) {
            this.pointsCount = parsed;
        }
    }

    private readonly handleClick = (event: MouseEvent) => {
        const clickCoordinate: Coordinate = this.renderingtType === CanvasRenderingType.Usual
            ? this.getClickCoordinatesForUsualCanvas(event)
            : this.getClickCoordinatesForWebGLCanvas(event);

        this.physics.run(clickCoordinate);
    };

    private getClickCoordinatesForUsualCanvas(event: MouseEvent): Coordinate {
        const rect = this.canvasElement.getBoundingClientRect();

        return {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
        };
    }

    private getClickCoordinatesForWebGLCanvas(event: MouseEvent): Coordinate {
         const rect = this.canvasElement.getBoundingClientRect();

    // Координаты клика в пикселях относительно canvas
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Преобразуем в координаты относительно ЦЕНТРА canvas
    const centerX = x - this.canvasElement.clientWidth / 2;
    const centerY = y - this.canvasElement.clientHeight / 2;

    console.log('Click in pixels from center:', centerX, centerY);
    
    return { 
        x: centerX, 
        y: centerY 
    };
    }

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