// Define the data that is needed to make a 3d cube
function createCubeData() {
  const positions = [
    // Front face
    -1.0, -1.0,  1.0,
    1.0, -1.0,  1.0,
    1.0,  1.0,  1.0,
    -1.0,  1.0,  1.0,

    // Back face
    -1.0, -1.0, -1.0,
    -1.0,  1.0, -1.0,
    1.0,  1.0, -1.0,
    1.0, -1.0, -1.0,

    // Top face
    -1.0,  1.0, -1.0,
    -1.0,  1.0,  1.0,
    1.0,  1.0,  1.0,
    1.0,  1.0, -1.0,

    // Bottom face
    -1.0, -1.0, -1.0,
    1.0, -1.0, -1.0,
    1.0, -1.0,  1.0,
    -1.0, -1.0,  1.0,

    // Right face
    1.0, -1.0, -1.0,
    1.0,  1.0, -1.0,
    1.0,  1.0,  1.0,
    1.0, -1.0,  1.0,

    // Left face
    -1.0, -1.0, -1.0,
    -1.0, -1.0,  1.0,
    -1.0,  1.0,  1.0,
    -1.0,  1.0, -1.0
  ];

  const colorsOfFaces = [
    [0.3, 1.0, 1.0, 1.0], // Front face: cyan
    [1.0, 0.3, 0.3, 1.0], // Back face: red
    [0.3, 1.0, 0.3, 1.0], // Top face: green
    [0.3, 0.3, 1.0, 1.0], // Bottom face: blue
    [1.0, 1.0, 0.3, 1.0], // Right face: yellow
    [1.0, 0.3, 1.0, 1.0] // Left face: purple
  ];

  let colors = [];

  for (var j = 0; j < 6; j++) {
    let polygonColor = colorsOfFaces[j];

    for (let i = 0; i < 4; i++) {
      colors = colors.concat(polygonColor);
    }
  }

  const elements = [
    0,  1,  2,      0,  2,  3,    // front
    4,  5,  6,      4,  6,  7,    // back
    8,  9,  10,     8,  10, 11,   // top
    12, 13, 14,     12, 14, 15,   // bottom
    16, 17, 18,     16, 18, 19,   // right
    20, 21, 22,     20, 22, 23    // left
  ];

  return {
    positions,
    elements,
    colors
  }
}

// Take the data for a cube and bind the buffers for it. Return an object collection of the buffers
function createBuffersForCube(gl, cube) {
  const positions = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positions);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cube.positions), gl.STATIC_DRAW);

  const colors = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colors);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cube.colors), gl.STATIC_DRAW);

  const elements = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, elements);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(cube.elements), gl.STATIC_DRAW);

  return {
    positions,
    colors,
    elements
  }
}

function matrixArrayToCssMatrix(array) {
  return `matrix3d(${array.join(',')})`;
}

function multiplyPoint(matrix, point) {
  const x = point[0], y = point[1], z = point[2], w = point[3];

  const c1r1 = matrix[ 0], c2r1 = matrix[ 1], c3r1 = matrix[ 2], c4r1 = matrix[ 3],
      c1r2 = matrix[ 4], c2r2 = matrix[ 5], c3r2 = matrix[ 6], c4r2 = matrix[ 7],
      c1r3 = matrix[ 8], c2r3 = matrix[ 9], c3r3 = matrix[10], c4r3 = matrix[11],
      c1r4 = matrix[12], c2r4 = matrix[13], c3r4 = matrix[14], c4r4 = matrix[15];

  return [
    x*c1r1 + y*c1r2 + z*c1r3 + w*c1r4,
    x*c2r1 + y*c2r2 + z*c2r3 + w*c2r4,
    x*c3r1 + y*c3r2 + z*c3r3 + w*c3r4,
    x*c4r1 + y*c4r2 + z*c4r3 + w*c4r4
  ];
}

function multiplyMatrices(a, b) {
  // currently taken from https://github.com/toji/gl-matrix/blob/master/src/gl-matrix/mat4.js#L306-L337

  const result = [];

  const a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3],
      a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7],
      a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11],
      a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];

  // Cache only the current line of the second matrix
  let b0  = b[0], b1 = b[1], b2 = b[2], b3 = b[3];
  result[0] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
  result[1] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
  result[2] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
  result[3] = b0*a03 + b1*a13 + b2*a23 + b3*a33;

  b0 = b[4]; b1 = b[5]; b2 = b[6]; b3 = b[7];
  result[4] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
  result[5] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
  result[6] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
  result[7] = b0*a03 + b1*a13 + b2*a23 + b3*a33;

  b0 = b[8]; b1 = b[9]; b2 = b[10]; b3 = b[11];
  result[8] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
  result[9] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
  result[10] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
  result[11] = b0*a03 + b1*a13 + b2*a23 + b3*a33;

  b0 = b[12]; b1 = b[13]; b2 = b[14]; b3 = b[15];
  result[12] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
  result[13] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
  result[14] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
  result[15] = b0*a03 + b1*a13 + b2*a23 + b3*a33;

  return result;
}

function multiplyArrayOfMatrices(matrices) {
  let inputMatrix = matrices[0];

  for (let i = 1; i < matrices.length; i++) {
    inputMatrix = multiplyMatrices(inputMatrix, matrices[i]);
  }

  return inputMatrix;
}

function rotateXMatrix(a) {
  const { cos, sin } = Math;

  return [
    1,      0,       0, 0,
    0, cos(a), -sin(a), 0,
    0, sin(a),  cos(a), 0,
    0,      0,       0, 1
  ];
}

function rotateYMatrix(a) {
  const { cos, sin } = Math;

  return [
      cos(a), 0, sin(a), 0,
          0, 1,      0, 0,
    -sin(a), 0, cos(a), 0,
          0, 0,      0, 1
  ];
}

function rotateZMatrix(a) {
  const { cos, sin } = Math;

  return [
    cos(a), -sin(a), 0, 0,
    sin(a),  cos(a), 0, 0,
          0,       0, 1, 0,
          0,       0, 0, 1
  ];
}

function translateMatrix(x, y, z) {
  return [
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    x, y, z, 1
  ];
}

function scaleMatrix(w, h, d) {
  return [
    w, 0, 0, 0,
    0, h, 0, 0,
    0, 0, d, 0,
    0, 0, 0, 1
  ];
}

function perspectiveMatrix(fieldOfViewInRadians, aspectRatio, near, far) {
  // Construct a perspective matrix

  /*
    Field of view - the angle in radians of what's in view along the Y axis
    Aspect Ratio - the ratio of the canvas, typically canvas.width / canvas.height
    Near - anything before this point in the Z direction gets clipped (outside of the clip space)
    Far - anything after this point in the Z direction gets clipped (outside of the clip space)
  */

  const f = 1.0 / Math.tan(fieldOfViewInRadians / 2);
  const rangeInv = 1 / (near - far);

  return [
    f / aspectRatio, 0, 0, 0,
    0, f, 0, 0,
    0, 0, (near + far) * rangeInv, -1,
    0, 0, near * far * rangeInv * 2, 0
  ];
}

function orthographicMatrix(left, right, bottom, top, near, far) {
  // Each of the parameters repersents the plane of the bounding box

  const lr = 1 / (left - right);
  const bt = 1 / (bottom - top);
  const nf = 1 / (near - far);

  const row4col1 = (left + right) * lr;
  const row4col2 = (top + bottom) * bt;
  const row4col3 = (far + near) * nf;

  return [
    -2 * lr, 0, 0, 0,
    0, -2 * bt, 0, 0,
    0, 0, 2 * nf, 0,
    row4col1, row4col2, row4col3, 1
  ];
}

function createShader(gl, source, type) {
  // Compiles either a shader of type gl.VERTEX_SHADER or gl.FRAGMENT_SHADER

  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    throw `Could not compile WebGL program. \n ${gl.getShaderInfoLog(shader)}`;
  }

  return shader;
}

function linkProgram(gl, vertexShader, fragmentShader) {
  const program = gl.createProgram();

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);

  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    throw `Could not compile WebGL program. \n ${gl.getProgramInfoLog(program)}`;
  }

  return program;
}

function createWebGLProgram(gl, vertexSource, fragmentSource) {
  // combine createShader() and linkProgram()

  const vertexShader = createShader(gl, vertexSource, gl.VERTEX_SHADER);
  const fragmentShader = createShader(gl, fragmentSource, gl.FRAGMENT_SHADER);

  return linkProgram(gl, vertexShader, fragmentShader);
}

function createWebGLProgramFromIds(gl, vertexSourceId, fragmentSourceId) {
  const vertexSourceEl = document.getElementById(vertexSourceId);
  const fragmentSourceEl = document.getElementById(fragmentSourceId);

  return createWebGLProgram(gl, vertexSourceEl.innerHTML, fragmentSourceEl.innerHTML);
}

function createContext(canvas) {
  let gl;

  try {
    // try to grab the standard context. If it fails, fallback to experimental.
    gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  } catch(e) {}

  if (!gl) {
    const message = 'Unable to initialize WebGL. Your browser may not support it.';
    alert(message);
    throw new Error(message);
    gl = null;
  }

  return gl;
}

export default {
  createCubeData,
  createBuffersForCube,
  matrixArrayToCssMatrix,
  multiplyPoint,
  multiplyMatrices,
  multiplyArrayOfMatrices,
  rotateXMatrix,
  rotateYMatrix,
  rotateZMatrix,
  translateMatrix,
  scaleMatrix,
  perspectiveMatrix,
  orthographicMatrix,
  createWebGLProgram,
  createWebGLProgramFromIds,
  createContext
};
