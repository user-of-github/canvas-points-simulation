import { Coordinate, Physics } from '../types';


type WasmExportsStructure = Omit<Physics, 'run'> & {
    mem: WebAssembly.Memory;
    run: (x: number, y: number) => void;
}

export class WebAssemblyPhysics implements Physics {
    private points: Float32Array = new Float32Array();
    private readonly wasmExports: WasmExportsStructure;

    public constructor(wasmInstance: WebAssembly.Instance) {
        this.wasmExports = wasmInstance.exports as unknown as WasmExportsStructure;
    }

    public run(coordinate: Coordinate): void {
        return this.wasmExports.run(coordinate.x, coordinate.y);
    }


    public tick(pointsCount: number): void {
        return this.wasmExports.tick(pointsCount);
    };


    public get data(): Readonly<Float32Array<ArrayBufferLike>> {
        const wasmBuffer = this.wasmExports.mem.buffer;

        if (wasmBuffer !== this.points.buffer) {
            this.points = new Float32Array(wasmBuffer);
        }

        return this.points;
    }
}