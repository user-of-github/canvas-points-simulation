export interface Dimension {
    width: number;
    height: number;
}

export interface Physics {
    run: (x: number, y: number) => void;
    tick: (pointsCount: number) => void;
    data: Readonly<Float32Array>
}