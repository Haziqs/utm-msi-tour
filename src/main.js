import * as THREE from 'three';
import { setupScene } from './core/scene.js';
import { setupTerrain } from './environment/terrain.js';
import { setupMovement, updateMovement, setCollidables } from './controls/movement.js';
import { loadModel } from './core/loaders.js';
import { setupHotspots } from './interactions/hotspots.js';

// ---- STATE MANAGEMENT ----
let isDay = true; // Declared at the top to resolve temporal dead zone!
let mosqueModel = null;

// Setup renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1));
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

// Setup core scene
const { scene, camera } = setupScene();

// Setup terrain & capture plot wireframe
const placeholderPlot = setupTerrain(scene);

// Setup controls
const controls = setupMovement(camera, document.body);
scene.add(controls.getObject());

// ---- LOAD MOSQUE MODEL ----
loadModel(
    '/models/masjidMSI.glb',
    (glb) => {
        // Hide the yellow placeholder box once the actual mosque loads!
        if (placeholderPlot) {
            scene.remove(placeholderPlot); 
        }

        mosqueModel = glb.scene;
        mosqueModel.scale.set(1, 1, 1);
        mosqueModel.position.set(0, 0, -30);
        scene.add(mosqueModel);
        console.log('✅ Mosque model loaded successfully!');

        const collidableMeshes = [];
        mosqueModel.traverse((child) => {
            if (child.isMesh) collidableMeshes.push(child);
        });
        setCollidables(collidableMeshes);

        const { addHotspot } = setupHotspots(
            scene,
            camera,
            renderer,
            (info) => {
                document.getElementById('info-title').textContent = info.title;
                document.getElementById('info-description').textContent = info.description;
                document.getElementById('info-panel').style.display = 'block';
            }
        );

        mosqueModel.traverse((child) => {
            if (child.isMesh) {
                const name = child.name.toLowerCase();
                if (name.includes('mimbar')) {
                    addHotspot(child, {
                        title: '🕌 Mimbar',
                        description: 'The mimbar is the pulpit where the imam delivers the Friday sermon (khutbah).'
                    });
                } else if (name.includes('charity') || name.includes('donation')) {
                    addHotspot(child, {
                        title: '💚 Charity Box',
                        description: 'Donation boxes are placed around the mosque for worshippers to contribute.'
                    });
                } else if (name.includes('lectern') || name.includes('quran')) {
                    addHotspot(child, {
                        title: '📖 Quran Lectern',
                        description: 'These lecterns hold copies of the Quran for worshippers to read.'
                    });
                } else if (name.includes('vending')) {
                    addHotspot(child, {
                        title: '🥤 Vending Machine',
                        description: 'Vending machines are available for worshippers to purchase drinks and snacks.'
                    });
                } else if (name.includes('bench')) {
                    addHotspot(child, {
                        title: '🪑 Bench',
                        description: 'Benches are placed around the mosque exterior for visitors to rest.'
                    });
                }
            }
        });
    },
    undefined,
    (error) => {
        console.error('❌ Error:', error);
    }
);

// ---- KEYBOARD SHORTCUTS ----
document.addEventListener('keydown', (e) => {
    // L = Lighting & Sky color toggle
    if (e.key === 'l' || e.key === 'L') {
        isDay = !isDay;
        const ambient = scene.children.find(c => c.isAmbientLight);
        const dirLight = scene.children.find(c => c.isDirectionalLight);
        
        const dayColor = new THREE.Color(0x87ceeb); // Sky blue
        const nightColor = new THREE.Color(0x0b1128); // Deep midnight blue

        if (ambient) ambient.intensity = isDay ? 0.6 : 0.15;
        if (dirLight) dirLight.intensity = isDay ? 1.0 : 0.2;
        
        // Dynamically shift sky and fog colors
        scene.background = isDay ? dayColor : nightColor;
        if (scene.fog) scene.fog.color = isDay ? dayColor : nightColor;

        console.log(`💡 Lighting: ${isDay ? 'Day' : 'Night'} mode`);
    }

    // R = Reset camera
    if (e.key === 'r' || e.key === 'R') {
        camera.position.set(0, 1.6, 50);
    }

    // H = Toggle help overlay (fixed double-tap issue)
    if (e.key === 'h' || e.key === 'H') {
        const help = document.getElementById('help-overlay');
        if (help) {
            const isHidden = window.getComputedStyle(help).display === 'none';
            help.style.display = isHidden ? 'block' : 'none';
        }
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