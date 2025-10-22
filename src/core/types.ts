export interface Dimension {
    width: number;
    height: number;
}

export interface Physics {
    run: (x: number, y: number) => void;
    tick: (pointsCount: number) => void;
    data: Readonly<Float32Array>
}

export interface Renderer {
    setPointSize: (pointSize: number) => void;
    render: (data: Float32Array, pointsAmount: number, {width, height}: Dimension) => void;
    init: () => Promise<void>;
}