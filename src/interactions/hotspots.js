/**
 * FILE: src/interactions/hotspots.js
 * PURPOSE: Clickable hotspots that show information pop-ups.
 */

import * as THREE from 'three';

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
let hoveredObject = null;

export function setupHotspots(scene, camera, renderer, infoCallback) {
    // Store clickable objects with their info data
    const clickableObjects = [];

    // Function to add a clickable object
    function addHotspot(object, infoData) {
        object.userData.isHotspot = true;
        object.userData.info = infoData;
        clickableObjects.push(object);
    }

    // Click handler
    renderer.domElement.addEventListener('click', (event) => {
        const rect = renderer.domElement.getBoundingClientRect();
        pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(pointer, camera);
        const intersects = raycaster.intersectObjects(clickableObjects, true);

        if (intersects.length > 0) {
            let obj = intersects[0].object;
            // Traverse up to find parent with hotspot data
            while (obj && !obj.userData.isHotspot) {
                obj = obj.parent;
            }
            if (obj && obj.userData.isHotspot) {
                infoCallback(obj.userData.info);
            }
        }
    });

    // Hover effect
    renderer.domElement.addEventListener('mousemove', (event) => {
        const rect = renderer.domElement.getBoundingClientRect();
        pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(pointer, camera);
        const intersects = raycaster.intersectObjects(clickableObjects, true);

        if (intersects.length > 0) {
            renderer.domElement.style.cursor = 'pointer';
        } else {
            renderer.domElement.style.cursor = 'default';
        }
    });

    return { addHotspot, clickableObjects };
}