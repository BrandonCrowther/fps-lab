/**
 * Game state container
 */

import { Player } from './player.js';
import { GameMap, PLAYER_START } from './map.js';
import { Raycaster } from './raycaster.js';

export class Game {
  constructor() {
    this.map = new GameMap();
    this.player = new Player(
      PLAYER_START.x,
      PLAYER_START.y,
      PLAYER_START.angle
    );
    this.raycaster = new Raycaster();
  }

  /**
   * Update game state
   * @param {InputHandler} input - Input handler
   * @param {number} deltaTime - Time since last frame in seconds
   */
  update(input, deltaTime) {
    const movement = input.getMovement();

    // Rotate player
    this.player.rotate(movement.rotate, deltaTime);

    // Move player
    this.player.move(movement.forward, movement.strafe, this.map, deltaTime);
  }

  /**
   * Cast all rays and return results
   * @returns {RayHit[]}
   */
  getRays() {
    return this.raycaster.castRays(this.player, this.map);
  }
}
