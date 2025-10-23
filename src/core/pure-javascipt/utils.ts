export const resizeF32Array = (old: Readonly<Float32Array>, newLength: number): Float32Array => {
    const resized = new Float32Array(newLength);
    resized.set(old.subarray(0, Math.min(old.length, newLength)));
    return resized;
};