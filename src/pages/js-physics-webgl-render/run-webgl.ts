import { PointsAnimation } from '../../core/points-animation';
import { JavaScriptPhysics } from '../../core/pure-javascipt/physics';
import { CanvasRenderingType } from '../../core/types';
import { WebGLCanvasRenderer } from '../../core/webgl/renderer';
import { Config } from '../../core/config';

function main() {
    const pointsCountInput = document.getElementById(Config.pointsCountInputId) as HTMLInputElement;
    const fpsOutput = document.getElementById(Config.fpsOutputBlockId) as HTMLElement;
    const pointsSizeChangeInput = document.getElementById(Config.pointsSizeInput) as HTMLInputElement;
    const canvasElement = document.getElementById(Config.canvasElementId) as HTMLCanvasElement
    const physicsJavaScriptEngine = new JavaScriptPhysics();
    const webglCanvasRenderer = new WebGLCanvasRenderer(canvasElement);

    const pointsAnimation = new PointsAnimation(
        physicsJavaScriptEngine,
        webglCanvasRenderer, 
        CanvasRenderingType.WebGL,
        canvasElement, 
        pointsCountInput,
        fpsOutput,
        pointsSizeChangeInput
    );

    pointsAnimation.setupHandlers();
    pointsAnimation.startListening();
}

main();