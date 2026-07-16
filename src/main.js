/**
 * FILE: src/main.js
 * PURPOSE: Entry point for the 3D scene.
 */

import * as THREE from 'three';
import { setupScene } from './core/scene.js';
import { setupTerrain } from './environment/terrain.js';
import { setupMovement, updateMovement } from './controls/movement.js';
import { loadModel } from './core/loaders.js';  // ✅ ADDED
import { setupHotspots } from './interactions/hotspots.js';  // ✅ ADDED

// Setup renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

// Setup core scene
const { scene, camera } = setupScene();

// Setup terrain
setupTerrain(scene);

// Setup controls
const controls = setupMovement(camera, document.body);
scene.add(controls.getObject());

// ---- LOAD MOSQUE MODEL ----
let mosqueModel = null;
loadModel(
    '/models/masjidMSI.glb',
    (glb) => {
        mosqueModel = glb.scene;
        mosqueModel.scale.set(1, 1, 1);
        mosqueModel.position.set(0, 0, -30);
        scene.add(mosqueModel);
        console.log('✅ Mosque model loaded successfully!');

        // --- Setup hotspots AFTER model loads ---
        const { addHotspot, clickableObjects } = setupHotspots(
            scene,
            camera,
            renderer,
            (info) => {
                // Show info pop-up
                document.getElementById('info-title').textContent = info.title;
                document.getElementById('info-description').textContent = info.description;
                document.getElementById('info-panel').style.display = 'block';
            }
        );

        // Find and add hotspots inside the model
        mosqueModel.traverse((child) => {
            if (child.isMesh) {
                // Check if this mesh is a hotspot by name
                const name = child.name.toLowerCase();
                if (name.includes('mimbar')) {
                    addHotspot(child, {
                        title: '🕌 Mimbar',
                        description: 'The mimbar is the pulpit where the imam delivers the Friday sermon (khutbah). It is an important focal point in the prayer hall.'
                    });
                } else if (name.includes('charity') || name.includes('donation')) {
                    addHotspot(child, {
                        title: '💚 Charity Box',
                        description: 'Donation boxes are placed around the mosque for worshippers to contribute to the mosque\'s maintenance and community programs.'
                    });
                } else if (name.includes('lectern') || name.includes('quran')) {
                    addHotspot(child, {
                        title: '📖 Quran Lectern',
                        description: 'These lecterns hold copies of the Quran for worshippers to read during their visit. The Quran is the holy book of Islam.'
                    });
                } else if (name.includes('vending')) {
                    addHotspot(child, {
                        title: '🥤 Vending Machine',
                        description: 'Vending machines are available for worshippers to purchase drinks and snacks. All proceeds go towards mosque maintenance.'
                    });
                } else if (name.includes('bench')) {
                    addHotspot(child, {
                        title: '🪑 Bench',
                        description: 'Benches are placed around the mosque exterior for visitors to rest and enjoy the peaceful surroundings.'
                    });
                }
            }
        });

        console.log('✅ Hotspots setup complete!');
    },
    undefined,
    (error) => console.error('❌ Error loading model:', error)
);

// ---- LIGHTING TOGGLE ----
let isDay = true;
document.addEventListener('keydown', (e) => {
    if (e.key === 'l' || e.key === 'L') {
        isDay = !isDay;
        const ambient = scene.children.find(c => c.isAmbientLight);
        const dirLight = scene.children.find(c => c.isDirectionalLight);
        if (ambient) ambient.intensity = isDay ? 0.6 : 0.15;
        if (dirLight) dirLight.intensity = isDay ? 1.0 : 0.2;
        console.log(`💡 Lighting: ${isDay ? 'Day' : 'Night'} mode`);
    }
});

// Resize handler
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Main loop
const clock = new THREE.Clock();
function animate() {
    requestAnimationFrame(animate);
    const delta = clock.getDelta();
    updateMovement(delta, camera);
    renderer.render(scene, camera);
}
animate();