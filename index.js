const vertexShaderText = `
    precision mediump float;

    attribute vec2 vertPosition;
    attribute vec3 vertColor;

    varying vec3 fragColor;

    void main() {
        fragColor = vertColor;
        gl_Position = vec4(vertPosition, 0.0, 1.0);
    }
`;

const fragmentShaderText = `
    precision mediump float;

    varying vec3 fragColor;

    void main() {
        gl_FragColor = vec4(fragColor, 1.0);
    }
`;

const canvasElement = document.getElementById("mycanvas");
const gl = canvasElement.getContext("webgl");

if(!gl) {
    alert("WebGL is not supported!");
    throw new Error("No WebGL support");
}

gl.clearColor(1.0, 0, 0, 1.0);
gl.clear(gl.COLOR_BUFFER_BIT || gl.DEPTH_BUFFER_BIT);

const vertexShader = gl.createShader(gl.VERTEX_SHADER);
const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

gl.shaderSource(vertexShader, vertexShaderText);
gl.shaderSource(fragmentShader, fragmentShaderText);

gl.compileShader(vertexShader);
gl.compileShader(fragmentShader);

const vertexShaderComplete = gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS);
if(!vertexShaderComplete) throw new Error("Vertex shader error: " + gl.getShaderInfoLog(vertexShader));

const fragmentShaderComplete = gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS);
if(!fragmentShaderComplete) throw new Error("Fragment shader error: " + gl.getShaderInfoLog(fragmentShader));

const program = gl.createProgram();
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);

const programLinkStatus = gl.getProgramParameter(program, gl.LINK_STATUS);
if(!programLinkStatus) throw new Error("Program link error: " + gl.getProgramInfoLog(program));


const triVertices = [
    0.0, 0.5, 1.0, 1.0, 0.0,
    0.5, -0.5, 0.0, 1.0, 1.0,
    -0.5, -0.5, 1.0, 0.0, 1.0
];
const triBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, triBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triVertices), gl.STATIC_DRAW);

const positionAttribLocation = gl.getAttribLocation(program, "vertPosition");
gl.vertexAttribPointer(positionAttribLocation, 2, gl.FLOAT, gl.FALSE, 5 * Float32Array.BYTES_PER_ELEMENT, 0);

const colorAttribLocation = gl.getAttribLocation(program, "vertColor");
gl.vertexAttribPointer(colorAttribLocation, 3, gl.FLOAT, gl.FALSE, 5 * Float32Array.BYTES_PER_ELEMENT, 2 * Float32Array.BYTES_PER_ELEMENT);

gl.enableVertexAttribArray(positionAttribLocation);
gl.enableVertexAttribArray(colorAttribLocation);

gl.useProgram(program);
gl.drawArrays(gl.TRIANGLES, 0, 3);