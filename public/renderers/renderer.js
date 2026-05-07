/**
 * Renderer interface/base class
 */

export class Renderer {
  /**
   * Initialize the renderer and create DOM elements
   * @param {HTMLElement} container - Container element
   */
  init(container) {
    throw new Error('init() must be implemented');
  }

  /**
   * Render a frame from ray data
   * @param {RayHit[]} rays - Array of ray hit results
   * @param {Game} game - Game state
   */
  render(rays, game) {
    throw new Error('render() must be implemented');
  }

  /**
   * Clean up DOM elements
   */
  destroy() {
    throw new Error('destroy() must be implemented');
  }

  /**
   * Get display name for this renderer
   * @returns {string}
   */
  getName() {
    throw new Error('getName() must be implemented');
  }
}
