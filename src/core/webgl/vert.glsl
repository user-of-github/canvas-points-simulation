precision lowp float; // точность

attribute vec2 coord;
attribute vec2 scale;
uniform float pointSize; // for controling point size from JS

void main() {
    gl_Position = vec4(
        coord.x * scale.x,
        coord.y * scale.y,
        0,
        1
    );

    gl_PointSize = pointSize;
}