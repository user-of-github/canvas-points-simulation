import { Coordinate, Physics } from '../types';

export class WebAssemblyPhysics implements Physics {
    private points: Float32Array = new Float32Array();

    public constructor(private readonly wasmInstance: WebAssembly.Instance) {

    }

    public run(coordinate: Coordinate): void {
        return this.wasmInstance.exports.run(coordinate.x, coordinate.y);
    }


    public tick(pointsCount: number): void {
        return this.wasmInstance.exports.tick(pointsCount);
    };


    public get data(): Readonly<Float32Array<ArrayBufferLike>> {
        const wasmExports = this.wasmInstance.exports;

        if (wasmExports.mem.buffer !== this.points.buffer) {
            this.points = new Float32Array(wasmExports.mem.buffer);
        }

        return this.points;
    }
}