/**
 * ASCII text renderer for debugging
 */

import { Renderer } from "./renderer.js";

const ASCII_WIDTH = 160;
const ASCII_HEIGHT = 80;

// Characters by density (darkest to lightest)
const DENSITY_CHARS = "@%#*+=-:. ";

export class AsciiRenderer extends Renderer {
  constructor() {
    super();
    this.pre = null;
  }

  init(container) {
    this.pre = document.createElement("pre");
    this.pre.style.fontFamily = "monospace";
    this.pre.style.fontSize = "8px";
    this.pre.style.lineHeight = "1";
    this.pre.style.margin = "0";
    this.pre.style.padding = "10px";
    this.pre.style.backgroundColor = "#000";
    this.pre.style.color = "#0f0";
    this.pre.style.whiteSpace = "pre";
    container.appendChild(this.pre);
  }

  render(rays, game) {
    const grid = [];

    // Initialize grid with spaces
    for (let y = 0; y < ASCII_HEIGHT; y++) {
      grid[y] = new Array(ASCII_WIDTH).fill(" ");
    }

    // Sample rays for ASCII width
    const rayStep = rays.length / ASCII_WIDTH;

    for (let x = 0; x < ASCII_WIDTH; x++) {
      const rayIndex = Math.floor(x * rayStep);
      const ray = rays[rayIndex];

      // Calculate wall height based on distance
      const wallHeightRatio = Math.min(1, 1 / ray.distance);
      const wallHeight = Math.floor(wallHeightRatio * ASCII_HEIGHT);

      // Calculate vertical position
      const wallTop = Math.floor((ASCII_HEIGHT - wallHeight) / 2);
      const wallBottom = wallTop + wallHeight;

      // Draw ceiling
      for (let y = 0; y < wallTop; y++) {
        grid[y][x] = " ";
      }

      // Draw wall
      for (let y = wallTop; y < wallBottom && y < ASCII_HEIGHT; y++) {
        // Density based on distance
        const densityIndex = Math.min(
          DENSITY_CHARS.length - 1,
          Math.floor(ray.distance * 0.8),
        );

        // Different char for different wall types
        let char = DENSITY_CHARS[densityIndex];
        if (ray.side === 1) {
          // EW walls get slightly different treatment
          char =
            DENSITY_CHARS[Math.min(densityIndex + 1, DENSITY_CHARS.length - 1)];
        }

        grid[y][x] = char;
      }

      // Draw floor
      for (let y = Math.max(0, wallBottom); y < ASCII_HEIGHT; y++) {
        grid[y][x] = ".";
      }
    }

    // Build text output
    const text = grid.map((row) => row.join("")).join("\n");
    this.pre.textContent = text;
  }

  destroy() {
    if (this.pre && this.pre.parentNode) {
      this.pre.parentNode.removeChild(this.pre);
    }
    this.pre = null;
  }

  getName() {
    return "ASCII";
  }
}
