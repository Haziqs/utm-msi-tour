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

    function isPointerLocked() {
        return !!document.pointerLockElement;
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
                    return null;
                }
                return { object: obj, point: intersects[0].point };
            }
        }
        return null;
    }

    const crosshair = document.getElementById('crosshair');
    if (!crosshair) {
        console.warn('⚠️ #crosshair element not found in HTML — crosshair color change will not work.');
    }

    // Click handler — use mousedown on document because 'click' is
    // consumed by PointerLock for lock/unlock and never reaches the canvas.
    document.addEventListener('mousedown', (event) => {
        if (event.button !== 0) return; // left-click only

        if (isPointerLocked()) {
            pointer.x = 0;
            pointer.y = 0;
        } else {
            const rect = renderer.domElement.getBoundingClientRect();
            pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        }

        const hit = checkIntersection();
        if (hit) {
            // Exit pointer lock so user can interact with the info panel
            if (isPointerLocked()) document.exitPointerLock();
            infoCallback(hit.object.userData.info, hit.point);
        }
    });

    // Locked mode: crosshair turns active when looking at a hotspot
    document.addEventListener('mousemove', () => {
        if (!isPointerLocked()) return;
        pointer.x = 0;
        pointer.y = 0;
        const hit = checkIntersection();
        if (crosshair) crosshair.classList.toggle('active', !!hit);
    });

    // Unlocked mode: cursor pointer/default on hover
    renderer.domElement.addEventListener('mousemove', (event) => {
        if (isPointerLocked()) return;
        const rect = renderer.domElement.getBoundingClientRect();
        pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        const hit = checkIntersection();
        renderer.domElement.style.cursor = hit ? 'pointer' : 'default';
    });

    return { addHotspot, clickableObjects };
}