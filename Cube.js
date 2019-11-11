import MDN from './MDN.js';
import Program from './Program.js';
import Renderer from './Renderer.js';

export default class CubeDemo {
  constructor() {
    // Prep the canvas
    const renderer = this.renderer = new Renderer({
      canvas: document.getElementById('canvas'),
      width: window.innerWidth,
      height: window.innerHeight
    });

    // Grab a context
    const gl = this.gl = renderer.gl;

    this.transforms = {}; // all of the matrix tranforms

    // get the rest going
    this.buffers = MDN.createBuffersForCube(gl, MDN.createCubeData());
    const program = new Program(gl, {
      vertex: document.getElementById('vertex-shader').innerHTML,
      fragment: document.getElementById('fragment-shader').innerHTML
    });

    this.locations = program.locations;
    this.program = program.program;
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
