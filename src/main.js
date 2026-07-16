/**
 * FILE: src/main.js
 * PURPOSE: Entry point for the 3D scene. Sets up the renderer, main loop, and window resizing.
 * NOTE: Anyone can edit — roger in the group chat before pushing to main.
 */

import * as THREE from 'three';
import { setupScene } from './core/scene.js';
import { setupTerrain } from './environment/terrain.js';
import { setupMovement, updateMovement } from './controls/movement.js';

// Setup basic renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

// Setup core scene (scene, camera, lights)
const { scene, camera } = setupScene();

// Setup environment (ground, pathway, mosque plot)
setupTerrain(scene);

// Setup controls (PointerLockControls)
const controls = setupMovement(camera, document.body);
scene.add(controls.getObject());

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Main render loop
const clock = new THREE.Clock();
function animate() {
    requestAnimationFrame(animate);
    
    const delta = clock.getDelta();
    updateMovement(delta, camera);
    
    renderer.render(scene, camera);
}

animate();
