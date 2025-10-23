import { Config } from '../../core/config';
import { WebAssemblyPhysics } from '../../core/wasm/physics';
import wasmModuleInit from '../../core/wasm/physics.wasm?init';
import { JavascriptCanvasRenderer } from '../../core/pure-javascipt/renderer';
import { CanvasRenderingType } from '../../core/types';
import { PointsAnimation } from '../../core/points-animation';


async function main() {
    const pointsCountInput = document.getElementById(Config.pointsCountInputId) as HTMLInputElement;
    const fpsOutput = document.getElementById(Config.fpsOutputBlockId) as HTMLElement;
    const pointsSizeChangeInput = document.getElementById(Config.pointsSizeInput) as HTMLInputElement;
    const canvasElement = document.getElementById(Config.canvasElementId) as HTMLCanvasElement;

    const instance: WebAssembly.Instance = await wasmModuleInit({
             Math: {
                random: (): number => Math.random(),
                sin: (x: number): number => Math.sin(x),
                cos: (x: number): number => Math.cos(x)
            }
    });

    const physicsJavaScriptEngine = new WebAssemblyPhysics(instance);
    const javascriptCanvasRenderer = new JavascriptCanvasRenderer(canvasElement);
    

    const pointsAnimation = new PointsAnimation(
        physicsJavaScriptEngine,
        javascriptCanvasRenderer, 
        CanvasRenderingType.Usual,
        canvasElement, 
        pointsCountInput,
        fpsOutput,
        pointsSizeChangeInput
    );

    pointsAnimation.setupHandlers();
    pointsAnimation.startListening();
}


main()