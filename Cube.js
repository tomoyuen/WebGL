import MDN from './MDN.js';

export default class CubeDemo {
  constructor() {
    // Prep the canvas
    this.canvas = document.getElementById('canvas');
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;

    // Grab a context
    this.gl = MDN.createContext(this.canvas);

    this.transforms = {}; // all of the matrix tranforms
    this.locations = {}; // all of the shader locations

    // get the rest going
    this.buffers = MDN.createBuffersForCube(this.gl, MDN.createCubeData());
    this.webglProgram = this.setupProgram();
  }
  setupProgram() {
    const gl = this.gl;

    // setup a webgl program
    const webglProgram = MDN.createWebGLProgramFromIds(gl, 'vertex-shader', 'fragment-shader');
    gl.useProgram(webglProgram);

    // save the attribute and uniform locations
    this.locations.model = gl.getUniformLocation(webglProgram, 'model');
    this.locations.view = gl.getUniformLocation(webglProgram, 'view');
    this.locations.projection = gl.getUniformLocation(webglProgram, 'projection');
    this.locations.position = gl.getAttribLocation(webglProgram, 'position');
    this.locations.color = gl.getAttribLocation(webglProgram, 'color');

    // tell webgl to test the depth when drawing
    gl.enable(gl.DEPTH_TEST);

    return webglProgram;
  }
  computePerspectiveMatrix() {
    const fieldOfViewInRadians = Math.PI * 0.5;
    const aspectRatio = window.innerWidth / window.innerHeight;
    const nearClippingPlaneDistance = 1;
    const farClippingPlaneDistance = 50;

    this.transforms.projection = MDN.perspectiveMatrix(
      fieldOfViewInRadians,
      aspectRatio,
      nearClippingPlaneDistance,
      farClippingPlaneDistance
    );
  }
  computeViewMatrix(now) {
    const zoomInAndOut = 5 * Math.sin(now * 0.002);

    // move slightly down
    const position = MDN.translateMatrix(0, 0, -20 + zoomInAndOut);

    // multiply together, make sure and read them in opposite order
    this.transforms.view = position;
  }
  computeModelMatrix(row) {
    // scale up
    const scale = MDN.scaleMatrix(5, 5, 5);

    // rotate a slight tilt
    const rotateX = MDN.rotateXMatrix(Math.PI * 0.2);

    // rotate according to time
    const rotateY = MDN.rotateYMatrix(Math.PI * 0.2);

    // move slightly down
    const position = MDN.translateMatrix(0, 0, 0);

    // multiply together, make sure and read them in opposite order
    this.transforms.model = MDN.multiplyArrayOfMatrices([position, rotateX, rotateY, scale]);
  }
  draw() {
    const gl = this.gl;
    const now = Date.now();

    // compute our matrices
    this.computeModelMatrix(now);
    this.computeViewMatrix(now);
    this.computePerspectiveMatrix(0.5);

    // update the data going to the GPU
    this.updateAttributesAndUniforms();

    gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);

    // run the draw as a loop
    requestAnimationFrame(this.draw.bind(this));
  }
  updateAttributesAndUniforms() {
    const gl = this.gl;

    // setup the color uniform that will be shared across all triangles
    gl.uniformMatrix4fv(this.locations.model, false, new Float32Array(this.transforms.model));
    gl.uniformMatrix4fv(this.locations.projection, false, new Float32Array(this.transforms.projection));
    gl.uniformMatrix4fv(this.locations.view, false, new Float32Array(this.transforms.view));

    // set the positions attribute
    gl.enableVertexAttribArray(this.locations.position);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.positions);
    gl.vertexAttribPointer(this.locations.position, 3, gl.FLOAT, false, 0, 0);

    // set the colors attribute
    gl.enableVertexAttribArray(this.locations.color);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.colors);
    gl.vertexAttribPointer(this.locations.color, 4, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.buffers.elements);
  }
}
