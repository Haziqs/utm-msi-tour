# UTM MSI Tour - Foundation

Browser-based interactive 3D campus tour of Masjid Sultan Ismail (MSI) at UTM.

## Setup
1. `npm install`
2. `npm run dev`

## Team Instructions
Anyone can edit any file. Please announce your changes in the group chat before pushing to `main`.

## Controls

| Input | Action |
|---|---|
| `W` `A` `S` `D` | Move around |
| Mouse | Look around |
| `Space` | Fly up |
| `Shift` | Fly down |
| `Q` | Sprint |
| `L` | Toggle day / night lighting |
| `R` | Reset camera to starting position |
| `H` | Toggle the on-screen help overlay |
| Click | Interact with hotspots (shows info panel) |

On page load, click **Start Tour** on the welcome screen, then click anywhere on the scene to lock the mouse pointer and begin moving.

## Features

- **Welcome screen** — intro screen with title and quick controls summary before the tour starts.
- **Pointer-lock navigation** — free-fly first-person movement through the 3D scene using WASD + mouse look.
- **Interactive hotspots** — clickable points on the mosque model that open an info panel describing that part of the building:
  - 🕌 Mimbar
  - 💚 Charity Box
  - 📖 Quran Lectern
  - 🥤 Vending Machine
  - 🪑 Bench
- **Day / night lighting toggle** (`L`) — switches ambient and directional light intensity.
- **Camera reset** (`R`) — snaps the camera back to the starting position if you get lost.
- **Help overlay** (`H`) — a persistent on-screen reminder of all controls, toggleable at any time.

## Project Structure

```
utm-msi-tour-main/
├── index.html                  # Page shell: welcome screen, info panel, help overlay, blocker
├── vite.config.js              # Vite dev server + build config
├── package.json                # Dependencies (three, vite)
├── public/
│   └── models/
│       └── masjidMSI.glb       # 3D mosque model
└── src/
    ├── main.js                 # Entry point — wires everything together, hotspot data, keyboard shortcuts
    ├── core/
    │   ├── scene.js             # Scene, camera, and lighting setup
    │   └── loaders.js           # GLTF model loading
    ├── environment/
    │   └── terrain.js          # Ground / terrain setup
    ├── controls/
    │   └── movement.js         # WASD + pointer-lock movement logic
    └── interactions/
        └── hotspots.js         # Raycasting for clickable hotspots
```

## Tech Stack

- [Three.js](https://threejs.org/) (`^0.160.0`) — 3D rendering
- [Vite](https://vitejs.dev/) (`^5.0.0`) — dev server and build tool
- Plain JavaScript (ES modules), no framework

## Troubleshooting

- **Blank/black screen** — check the browser console; the model path is `public/models/masjidMSI.glb`, so make sure the file exists there.
- **Mouse won't lock** — some browsers require a user click before pointer lock is granted; click directly on the 3D canvas after starting the tour.
- **Model not loading** — the info panel will automatically show a warning if `masjidMSI.glb` fails to load.