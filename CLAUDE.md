# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a browser-based Wolfenstein 3D-style raycaster FPS game written in vanilla JavaScript (ES6 modules). The game runs entirely client-side with no build step or dependencies.

## Running the Project

Open `index.html` directly in a browser or use a local web server:

```bash
python -m http.server 8000
# Then navigate to http://localhost:8000
```

## Architecture

### Core Game Loop

The game follows a classic game loop pattern in `src/main.js`:
1. **Input Processing** - Collect keyboard input via InputHandler
2. **Update** - Move player and update game state based on delta time
3. **Raycasting** - Cast all rays for the current frame
4. **Render** - Draw the scene using the active renderer
5. **Repeat** - Loop via requestAnimationFrame

### Module Responsibilities

- **main.js** - Entry point, game loop, renderer management
- **game.js** - Central game state container, coordinates player/map/raycaster
- **player.js** - Player position, movement with collision detection, rotation
- **map.js** - 16x16 grid map data, collision queries
- **raycaster.js** - DDA raycasting algorithm implementation
- **input.js** - Keyboard input handling with one-shot key detection
- **renderers/** - Pluggable rendering implementations

### Raycasting System

The raycaster uses the **DDA (Digital Differential Analysis)** algorithm:
- Casts 320 rays across a 60-degree FOV
- Returns `RayHit` objects containing: perpendicular distance, wall type, side (NS/EW), and texture coordinate
- Fish-eye correction is applied via perpendicular distance calculation
- Maximum ray depth is 20 grid units

### Renderer Architecture

Renderers implement an interface defined in `src/renderers/renderer.js`:
- **init(container)** - Create DOM elements
- **render(rays, game)** - Draw frame from ray data
- **destroy()** - Clean up DOM elements
- **getName()** - Return display name

Current renderers:
- **CanvasRenderer** - 640x480 2D canvas with colored wall slices
- **AsciiRenderer** - 160x80 character-based text rendering

Switch between renderers at runtime by pressing 'P'.

### Coordinate System

- Map is a 16x16 grid stored in row-major order (data[y][x])
- World coordinates are continuous floats (e.g., player at 2.5, 2.5)
- Grid coordinates are integers (cell indices)
- Angles are in radians, 0 = east, increases counter-clockwise

### Collision Detection

Player collision uses a radius-based approach (COLLISION_RADIUS = 0.2):
- Checks 4 offset points around the player (cardinal directions)
- X and Y movement are tested independently for sliding collision
- Out-of-bounds is treated as solid

## Key Constants

Located in individual modules (no central config):
- **raycaster.js**: FOV (π/3), NUM_RAYS (320), MAX_DEPTH (20)
- **player.js**: MOVE_SPEED (3.0), ROTATE_SPEED (2.0), COLLISION_RADIUS (0.2)
- **canvas-renderer.js**: CANVAS_WIDTH (640), CANVAS_HEIGHT (480)
- **ascii-renderer.js**: ASCII_WIDTH (160), ASCII_HEIGHT (80)

## Adding New Features

### Adding a New Renderer

1. Create a new file in `src/renderers/`
2. Extend the `Renderer` base class
3. Implement all required methods (init, render, destroy, getName)
4. Import and add to the `renderers` array in `src/main.js`

### Modifying the Map

Edit the `MAP_DATA` array in `src/map.js`:
- 0 = empty space
- 1, 2, 3 = different wall types with different colors
- Update `PLAYER_START` position if needed

### Adding Wall Textures

Wall texture X coordinates are already calculated in `RayHit.textureX` (0-1 range). To add textures:
- Load texture images in the renderer's init method
- Use `ray.textureX` to sample the correct column during rendering
- Different wall types are identified by `ray.wallType`
