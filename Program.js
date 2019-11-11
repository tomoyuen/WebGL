import MDN from './MDN.js';

export default class Program {
  constructor(gl, shaders) {
    this.gl = gl;
    this.locations = {};

    // setup a webgl program
    const program = this.program = MDN.createWebGLProgram(gl, shaders.vertex, shaders.fragment);
    gl.useProgram(program);

    // save the attribute and uniform locations
    this.locations.model = gl.getUniformLocation(program, 'model');
    this.locations.view = gl.getUniformLocation(program, 'view');
    this.locations.projection = gl.getUniformLocation(program, 'projection');
    this.locations.position = gl.getAttribLocation(program, 'position');
    this.locations.color = gl.getAttribLocation(program, 'color');

    // tell webgl to test the depth when drawing
    gl.enable(gl.DEPTH_TEST);
  }
}
