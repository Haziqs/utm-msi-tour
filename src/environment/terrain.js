/**
 * FILE: src/environment/terrain.js
 * PURPOSE: Creates the ground plane, pathways, and the marked empty plot for the mosque.
 * NOTE: Anyone can edit — roger in the group chat before pushing to main.
 */

import * as THREE from 'three';

export function setupTerrain(scene) {
    // 1. Ground Plane
    const groundGeo = new THREE.PlaneGeometry(500, 500);
    const groundMat = new THREE.MeshLambertMaterial({ color: 0x4f7942 }); // Grass green
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // 2. Pathway leading to the mosque plot
    const pathGeo = new THREE.PlaneGeometry(10, 100);
    const pathMat = new THREE.MeshLambertMaterial({ color: 0xcccccc }); // Concrete/gravel
    const path = new THREE.Mesh(pathGeo, pathMat);
    path.rotation.x = -Math.PI / 2;
    path.position.set(0, 0.05, 40); // Slightly above ground to prevent Z-fighting
    path.receiveShadow = true;
    scene.add(path);

    // 3. Mosque Plot (Reserved space)
    // Create a translucent box/outline to mark where the mosque .glb will be placed later
    const plotGeo = new THREE.BoxGeometry(40, 10, 40);
    const plotMat = new THREE.MeshBasicMaterial({ 
        color: 0xffff00, 
        wireframe: true, 
        transparent: true, 
        opacity: 0.5 
    });
    const plot = new THREE.Mesh(plotGeo, plotMat);
    // Center it where the path ends
    plot.position.set(0, 5, -30); 
    scene.add(plot);
}
