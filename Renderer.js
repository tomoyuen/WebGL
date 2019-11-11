import MDN from './MDN.js';

export default class Renderer {
  constructor({
    canvas = document.createElement('canvas'),
    width,
    height
  }) {
    this.canvas = canvas;
    this.canvas.width = width;
    this.canvas.height = height;
    this.gl = MDN.createContext(canvas);
  }
}
