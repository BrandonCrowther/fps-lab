/**
 * Main entry point - game loop and renderer switching
 */

import { Game } from './game.js';
import { InputHandler } from './input.js';
import { CanvasRenderer } from './renderers/canvas-renderer.js';
import { AsciiRenderer } from './renderers/ascii-renderer.js';

class Main {
  constructor() {
    this.container = document.getElementById('game-container');
    this.rendererInfo = document.getElementById('renderer-info');

    this.game = new Game();
    this.input = new InputHandler();

    // Available renderers
    this.renderers = [
      new CanvasRenderer(),
      new AsciiRenderer(),
    ];
    this.currentRendererIndex = 0;

    // Initialize first renderer
    this.currentRenderer = this.renderers[this.currentRendererIndex];
    this.currentRenderer.init(this.container);
    this.updateRendererInfo();

    // Timing
    this.lastTime = performance.now();

    // Start game loop
    this.gameLoop = this.gameLoop.bind(this);
    requestAnimationFrame(this.gameLoop);
  }

  gameLoop(currentTime) {
    // Calculate delta time in seconds
    const deltaTime = (currentTime - this.lastTime) / 1000;
    this.lastTime = currentTime;

    // Check for renderer switch
    if (this.input.wasPressed('p')) {
      this.switchRenderer();
    }

    // Update game state
    this.game.update(this.input, deltaTime);

    // Cast rays
    const rays = this.game.getRays();

    // Render
    this.currentRenderer.render(rays, this.game);

    // Clear just pressed keys
    this.input.clearJustPressed();

    // Continue loop
    requestAnimationFrame(this.gameLoop);
  }

  switchRenderer() {
    // Destroy current renderer
    this.currentRenderer.destroy();

    // Switch to next renderer
    this.currentRendererIndex = (this.currentRendererIndex + 1) % this.renderers.length;
    this.currentRenderer = this.renderers[this.currentRendererIndex];

    // Initialize new renderer
    this.currentRenderer.init(this.container);
    this.updateRendererInfo();
  }

  updateRendererInfo() {
    if (this.rendererInfo) {
      this.rendererInfo.textContent = `Renderer: ${this.currentRenderer.getName()}`;
    }
  }
}

// Start when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new Main();
});
