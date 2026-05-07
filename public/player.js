/**
 * Player position, angle, and movement
 */

const MOVE_SPEED = 3.0; // Units per second
const ROTATE_SPEED = 2.0; // Radians per second
const COLLISION_RADIUS = 0.2; // Player collision radius

export class Player {
  constructor(x, y, angle) {
    this.x = x;
    this.y = y;
    this.angle = angle;
  }

  /**
   * Move the player with collision detection
   * @param {number} forward - Forward/backward input (-1 to 1)
   * @param {number} strafe - Strafe input (-1 to 1)
   * @param {GameMap} map - Map for collision detection
   * @param {number} deltaTime - Time since last frame in seconds
   */
  move(forward, strafe, map, deltaTime) {
    const speed = MOVE_SPEED * deltaTime;

    // Calculate movement direction
    const forwardX = Math.cos(this.angle) * forward * speed;
    const forwardY = Math.sin(this.angle) * forward * speed;

    // Strafe is perpendicular to forward direction
    const strafeX = Math.cos(this.angle + Math.PI / 2) * strafe * speed;
    const strafeY = Math.sin(this.angle + Math.PI / 2) * strafe * speed;

    const moveX = forwardX + strafeX;
    const moveY = forwardY + strafeY;

    // Try X movement
    const newX = this.x + moveX;
    if (!this.checkCollision(newX, this.y, map)) {
      this.x = newX;
    }

    // Try Y movement
    const newY = this.y + moveY;
    if (!this.checkCollision(this.x, newY, map)) {
      this.y = newY;
    }
  }

  /**
   * Check collision at a position
   * @param {number} x - X position to check
   * @param {number} y - Y position to check
   * @param {GameMap} map - Map for collision detection
   * @returns {boolean} True if collision detected
   */
  checkCollision(x, y, map) {
    // Check multiple points around the player's collision radius
    const offsets = [
      [COLLISION_RADIUS, 0],
      [-COLLISION_RADIUS, 0],
      [0, COLLISION_RADIUS],
      [0, -COLLISION_RADIUS],
    ];

    for (const [ox, oy] of offsets) {
      if (map.isSolid(x + ox, y + oy)) {
        return true;
      }
    }
    return false;
  }

  /**
   * Rotate the player
   * @param {number} amount - Rotation amount (-1 to 1)
   * @param {number} deltaTime - Time since last frame in seconds
   */
  rotate(amount, deltaTime) {
    this.angle += amount * ROTATE_SPEED * deltaTime;

    // Keep angle in [0, 2*PI] range
    while (this.angle < 0) this.angle += Math.PI * 2;
    while (this.angle >= Math.PI * 2) this.angle -= Math.PI * 2;
  }
}
