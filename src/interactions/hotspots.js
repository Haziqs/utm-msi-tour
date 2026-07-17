/**
 * FILE: src/interactions/hotspots.js
 * PURPOSE: Clickable hotspots that show information pop-ups.
 */

import * as THREE from 'three';

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2(0, 0); // Always center for PointerLock

export function setupHotspots(scene, camera, renderer, infoCallback) {
    const clickableObjects = [];

    function addHotspot(object, infoData) {
        object.userData.isHotspot = true;
        object.userData.info = infoData;
        clickableObjects.push(object);
    }

    function checkIntersection() {
        raycaster.setFromCamera(pointer, camera);
        const intersects = raycaster.intersectObjects(clickableObjects, true);
        if (intersects.length > 0) {
            let obj = intersects[0].object;
            while (obj && !obj.userData.isHotspot) {
                obj = obj.parent;
            }
            if (obj && obj.userData.isHotspot) {
                const info = obj.userData.info;
                if (info.condition && !info.condition(intersects[0].point)) {
                    return null; // Skip if condition fails
                }
                return { object: obj, point: intersects[0].point };
            }
        }
        return null;
    }

    document.addEventListener('mousedown', (event) => {
        // Only trigger if PointerLock is active and it's a left click (button 0)
        if (document.pointerLockElement && event.button === 0) {
            const hit = checkIntersection();
            if (hit) {
                // Exit pointer lock when opening info panel for better UX
                document.exitPointerLock();
                infoCallback(hit.object.userData.info, hit.point);
            }
        }
    });

    const crosshair = document.getElementById('crosshair');

    // In PointerLock, mousemove is fired when looking around
    document.addEventListener('mousemove', () => {
        if (document.pointerLockElement) {
            const obj = checkIntersection();
            if (obj && crosshair) {
                crosshair.classList.add('active');
            } else if (crosshair) {
                crosshair.classList.remove('active');
            }
        }
    });

    return { addHotspot, clickableObjects };
}