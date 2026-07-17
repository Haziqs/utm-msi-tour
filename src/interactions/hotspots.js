import * as THREE from 'three';

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

export function setupHotspots(scene, camera, renderer, infoCallback) {
    const clickableObjects = [];

    function addHotspot(object, infoData) {
        object.userData.isHotspot = true;
        object.userData.info = infoData;
        clickableObjects.push(object);
    }

    // Click handler
    renderer.domElement.addEventListener('click', (event) => {
        // If Pointer Lock is active, the cursor is locked inside.
        // We force the raycast directly through the center (0, 0)
        if (window.__controls && window.__controls.isLocked) {
            pointer.x = 0;
            pointer.y = 0;
        } else {
            const rect = renderer.domElement.getBoundingClientRect();
            pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        }

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

    // Hover effect (only applies when unlocked)
    renderer.domElement.addEventListener('mousemove', (event) => {
        if (window.__controls && window.__controls.isLocked) return;

        const rect = renderer.domElement.getBoundingClientRect();
        pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    const crosshair = document.getElementById('crosshair');

        renderer.domElement.style.cursor = intersects.length > 0 ? 'pointer' : 'default';
    });

    return { addHotspot, clickableObjects };
}