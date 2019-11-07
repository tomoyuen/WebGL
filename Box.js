import MDN from './MDN.js';

export default class WebGLBox {
  constructor() {
    // setup the canvas and WebGL context
    this.canvas = document.getElementById('canvas');
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    const gl = this.gl = MDN.createContext(canvas);

    // setup a webgl program
    const program = this.webglProgram = MDN.createWebGLProgramFromIds(gl, 'vertex-shader', 'fragment-shader');
    gl.useProgram(program);

    // save the attribute and uniform locations
    this.positionLocation = gl.getAttribLocation(program, 'position');
    this.colorLocaiton = gl.getUniformLocation(program, 'vColor');

    gl.enable(gl.DEPTH_TEST);
  }
  draw(settings) {
    // create some attribute data
    const data = new Float32Array([
      // triangle 1
      settings.left, settings.bottom, settings.depth, settings.w,
      settings.right, settings.bottom, settings.depth, settings.w,
      settings.left, settings.top, settings.depth, settings.w,

      // triangle 2
      settings.left, settings.top, settings.depth, settings.w,
      settings.right, settings.bottom, settings.depth, settings.w,
      settings.right, settings.top, settings.depth, settings.w
    ]);

    // use Webgl to draw this onto the screen
    const gl = this.gl;

    // create a buffer and bind the data
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);

    // setup the pointer to our attribute data
    gl.enableVertexAttribArray(this.positionLocation);
    gl.vertexAttribPointer(this.positionLocation, 4, gl.FLOAT, false, 0, 0);

    // setup the color uniform that will be shared across all triangles
    gl.uniform4fv(this.colorLocaiton, settings.color);

    // draw the triangles to the screen
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }
}
