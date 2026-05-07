/**
 * Canvas 2D renderer
 */

import { Renderer } from './renderer.js';

const CANVAS_WIDTH = 640;
const CANVAS_HEIGHT = 480;

// Wall colors by type
const WALL_COLORS = {
  1: { r: 180, g: 0, b: 0 },     // Red
  2: { r: 0, g: 180, b: 0 },     // Green
  3: { r: 0, g: 0, b: 180 },     // Blue
};

const CEILING_COLOR = '#333';
const FLOOR_COLOR = '#666';

export class CanvasRenderer extends Renderer {
  constructor() {
    super();
    this.canvas = null;
    this.ctx = null;
  }

  init(container) {
    this.canvas = document.createElement('canvas');
    this.canvas.width = CANVAS_WIDTH;
    this.canvas.height = CANVAS_HEIGHT;
    this.canvas.style.display = 'block';
    this.canvas.style.imageRendering = 'pixelated';
    container.appendChild(this.canvas);

    this.ctx = this.canvas.getContext('2d');
  }

  render(rays, game) {
    const ctx = this.ctx;
    const width = this.canvas.width;
    const height = this.canvas.height;

    // Draw ceiling
    ctx.fillStyle = CEILING_COLOR;
    ctx.fillRect(0, 0, width, height / 2);

    // Draw floor
    ctx.fillStyle = FLOOR_COLOR;
    ctx.fillRect(0, height / 2, width, height / 2);

    // Calculate slice width
    const sliceWidth = width / rays.length;

    // Draw walls
    for (let i = 0; i < rays.length; i++) {
      const ray = rays[i];

      // Calculate wall height based on distance
      const wallHeight = Math.min(height, height / ray.distance);

      // Calculate vertical position (centered)
      const wallTop = (height - wallHeight) / 2;

      // Get base color for wall type
      const baseColor = WALL_COLORS[ray.wallType] || { r: 128, g: 128, b: 128 };

      // Shade based on side (NS walls darker)
      const shade = ray.side === 0 ? 1.0 : 0.7;

      const r = Math.floor(baseColor.r * shade);
      const g = Math.floor(baseColor.g * shade);
      const b = Math.floor(baseColor.b * shade);

      ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;

      // Draw wall slice
      const x = i * sliceWidth;
      ctx.fillRect(x, wallTop, sliceWidth + 1, wallHeight);
    }
  }

  destroy() {
    if (this.canvas && this.canvas.parentNode) {
      this.canvas.parentNode.removeChild(this.canvas);
    }
    this.canvas = null;
    this.ctx = null;
  }

  getName() {
    return 'Canvas 2D';
  }
}
