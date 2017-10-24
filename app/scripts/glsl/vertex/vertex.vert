varying vec4 vColor;

void main() {
        gl_Position = vec4(position, 1);
        vColor = gl_Position * 0.5 + 0.5;
}


