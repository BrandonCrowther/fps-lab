/**
 * DDA Raycasting algorithm
 */

const FOV = Math.PI / 3; // 60 degrees
const NUM_RAYS = 320;
const MAX_DEPTH = 20;

/**
 * Result of a single ray cast
 */
export class RayHit {
  constructor(distance, wallType, side, textureX) {
    this.distance = distance; // Perpendicular distance to wall
    this.wallType = wallType; // Wall type (1, 2, 3, etc.)
    this.side = side; // 0 = NS wall, 1 = EW wall
    this.textureX = textureX; // X coordinate on wall texture (0-1)
  }
}

export class Raycaster {
  constructor() {
    this.numRays = NUM_RAYS;
    this.fov = FOV;
  }

  /**
   * Cast all rays for the current view
   * @param {Player} player - Player position and angle
   * @param {GameMap} map - Map data
   * @returns {RayHit[]} Array of ray hit results
   */
  castRays(player, map) {
    const rays = [];

    for (let i = 0; i < this.numRays; i++) {
      const ray = this.castRay(player, map, i);
      rays.push(ray);
    }

    return rays;
  }

  /**
   * Cast a single ray using DDA algorithm
   * @param {Player} player - Player position and angle
   * @param {GameMap} map - Map data
   * @param {number} screenX - Screen column (0 to numRays-1)
   * @returns {RayHit} Ray hit result
   */
  castRay(player, map, screenX) {
    // Calculate ray angle
    // Camera plane offset: -0.5 to 0.5
    const cameraX = (screenX / this.numRays) * 2 - 1; // -1 to 1
    const rayAngle = player.angle + cameraX * (this.fov / 2);

    // Ray direction
    const rayDirX = Math.cos(rayAngle);
    const rayDirY = Math.sin(rayAngle);

    // Current map cell
    let mapX = Math.floor(player.x);
    let mapY = Math.floor(player.y);

    // Length of ray from one X or Y side to next
    const deltaDistX = Math.abs(1 / rayDirX);
    const deltaDistY = Math.abs(1 / rayDirY);

    // Direction to step in X and Y
    let stepX, stepY;
    // Distance to next X or Y side
    let sideDistX, sideDistY;

    // Calculate step and initial sideDist
    if (rayDirX < 0) {
      stepX = -1;
      sideDistX = (player.x - mapX) * deltaDistX;
    } else {
      stepX = 1;
      sideDistX = (mapX + 1 - player.x) * deltaDistX;
    }

    if (rayDirY < 0) {
      stepY = -1;
      sideDistY = (player.y - mapY) * deltaDistY;
    } else {
      stepY = 1;
      sideDistY = (mapY + 1 - player.y) * deltaDistY;
    }

    // DDA algorithm
    let hit = false;
    let side = 0; // 0 = NS wall (hit on X), 1 = EW wall (hit on Y)
    let depth = 0;

    while (!hit && depth < MAX_DEPTH) {
      // Jump to next map square
      if (sideDistX < sideDistY) {
        sideDistX += deltaDistX;
        mapX += stepX;
        side = 0;
      } else {
        sideDistY += deltaDistY;
        mapY += stepY;
        side = 1;
      }

      depth++;

      // Check if ray hit a wall
      const cell = map.getCell(mapX, mapY);
      if (cell !== 0) {
        hit = true;
      }
    }

    // Calculate perpendicular distance (avoid fish-eye)
    let perpWallDist;
    if (side === 0) {
      perpWallDist = sideDistX - deltaDistX;
    } else {
      perpWallDist = sideDistY - deltaDistY;
    }

    // Avoid division by zero
    if (perpWallDist < 0.001) perpWallDist = 0.001;

    // Calculate texture X coordinate
    let wallX;
    if (side === 0) {
      wallX = player.y + perpWallDist * rayDirY;
    } else {
      wallX = player.x + perpWallDist * rayDirX;
    }
    wallX -= Math.floor(wallX);

    const wallType = map.getCell(mapX, mapY);

    return new RayHit(perpWallDist, wallType, side, wallX);
  }
}
