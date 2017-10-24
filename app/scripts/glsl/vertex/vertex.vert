varying vec4 vColor;
attribute vec3 color;

void main() {
        gl_Position = vec4(position, 1);
        //vColor = gl_Position * 0.5 + 0.5;
        vColor = vec4(color, 1.0);

}


