import { resizeF32Array } from '../../utils';
import { Physics } from './types';


export class JavaScriptPhysics implements Physics {
    private static readonly Acceleration = 0.01;
    private static readonly PI_2 = Math.PI * 2;
     
    /*
    [
        x, y, dx, dy, // For every point: coordinates: x, y; dx, dy -- current speed of changing coord on every tick,
        x, y, dx, dy,
        ...
    ]
    */
    private points: Float32Array = new Float32Array(0);

    public constructor() {}

    public get data(): Readonly<Float32Array> {
        return this.points;
    }

    public tick(pointsCount: number): void {
        this.points = resizeF32Array(this.points, pointsCount * 4); // pointsCount * 4 ==> for every point 4 params

        for (let pointer = 0; pointer < this.points.length; pointer += 4) {
            this.points[pointer + 0] += this.data[pointer + 2]; // x += dx
            this.points[pointer + 1] += this.data[pointer + 3]; // y += dy
            this.points[pointer + 3] += JavaScriptPhysics.Acceleration; // dy += acceleration (smth like gravity, to make not constant speed, but increasing)
        }
    }

    public run(startX: number, startY: number): void {
        console.log(startX, startY)
        for (let pointer = 0; pointer < this.points.length; pointer += 4) {
            // Filling all array with points in the click place with same coords, but different direction and start speed
            this.points[pointer + 0] = startX; 
            this.points[pointer + 1] = startY;
            const amplitude = Math.sqrt(Math.random()) * 30;
            const angle = Math.random() * JavaScriptPhysics.PI_2;

            this.points[pointer + 2] = Math.cos(angle) * amplitude; 
            this.points[pointer + 3] = Math.sin(angle) * amplitude;
        }
        
        console.log(this.points)
    }
}