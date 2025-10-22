import { PointsAnimation } from "./core/points-animation";
import { JavaScriptPhysics } from "./core/pure-javascipt/physics";


function main() {
    const physicsJavaScriptEngine = new JavaScriptPhysics();
    const pointsAnimation = new PointsAnimation(physicsJavaScriptEngine);

    pointsAnimation.setupHandlers();
    pointsAnimation.startListening();
}

main();