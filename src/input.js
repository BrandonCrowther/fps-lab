/**
 * Keyboard input handling
 */

export class InputHandler {
  constructor() {
    this.keys = new Set();
    this.justPressed = new Set();

    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);

    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);
  }

  handleKeyDown(e) {
    const key = e.key.toLowerCase();

    // Track just pressed keys (for one-shot detection)
    if (!this.keys.has(key)) {
      this.justPressed.add(key);
    }

    this.keys.add(key);

    // Prevent default for game keys
    if (['w', 'a', 's', 'd', 'arrowleft', 'arrowright', 'arrowup', 'arrowdown', 'p'].includes(key)) {
      e.preventDefault();
    }
  }

  handleKeyUp(e) {
    this.keys.delete(e.key.toLowerCase());
  }

  /**
   * Get current movement input
   * @returns {{forward: number, strafe: number, rotate: number}}
   */
  getMovement() {
    let forward = 0;
    let strafe = 0;
    let rotate = 0;

    // Forward/backward
    if (this.keys.has('w') || this.keys.has('arrowup')) forward += 1;
    if (this.keys.has('s') || this.keys.has('arrowdown')) forward -= 1;

    // Strafe
    if (this.keys.has('a')) strafe -= 1;
    if (this.keys.has('d')) strafe += 1;

    // Rotate
    if (this.keys.has('arrowleft')) rotate -= 1;
    if (this.keys.has('arrowright')) rotate += 1;

    return { forward, strafe, rotate };
  }

  /**
   * Check if a key was just pressed (one-shot)
   * @param {string} key - Key to check
   * @returns {boolean}
   */
  wasPressed(key) {
    return this.justPressed.has(key.toLowerCase());
  }

  /**
   * Clear just pressed keys (call at end of frame)
   */
  clearJustPressed() {
    this.justPressed.clear();
  }

  /**
   * Clean up event listeners
   */
  destroy() {
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);
  }
}
