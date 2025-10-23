export interface Dimension {
    width: number;
    height: number;
}

export const enum CanvasRenderingType {
    Usual = 'Usual',
    WebGL = 'WebGL'
};

export interface Coordinate {
    x: number;
    y: number;
}

export interface Physics {
    run: (coordinate: Coordinate) => void;
    tick: (pointsCount: number) => void;
    data: Readonly<Float32Array>;
}

export interface Renderer {
    setPointSize: (pointSize: number) => void;
    render: (data: Float32Array, pointsAmount: number, {width, height}: Dimension) => void;
}