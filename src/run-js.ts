import { Config } from "./core/config";
import { PointsAnimation } from "./core/points-animation";
import { JavaScriptPhysics } from "./core/pure-javascipt/physics";
import { JavascriptCanvasRenderer } from "./core/pure-javascipt/renderer";


function main() {
    const pointsCountInput = document.getElementById(Config.pointsCountInputId) as HTMLInputElement;
    const fpsOutput = document.getElementById(Config.fpsOutputBlockId) as HTMLElement;
    const pointsSizeChangeInput = document.getElementById(Config.pointsSizeInput) as HTMLInputElement;
    const canvasElement = document.getElementById(Config.canvasElementId) as HTMLCanvasElement
    const physicsJavaScriptEngine = new JavaScriptPhysics();
    const javascriptCanvasRenderer = new JavascriptCanvasRenderer(canvasElement);

    const pointsAnimation = new PointsAnimation(
        physicsJavaScriptEngine,
        javascriptCanvasRenderer, 
        canvasElement, 
        pointsCountInput,
        fpsOutput,
        pointsSizeChangeInput
    );

    pointsAnimation.setupHandlers();
    pointsAnimation.startListening();
}

main();