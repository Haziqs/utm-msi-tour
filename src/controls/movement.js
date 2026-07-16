/**
 * FILE: src/controls/movement.js
 * PURPOSE: Implements PointerLockControls for first-person WASD + mouse movement.
 * NOTE: Anyone can edit — roger in the group chat before pushing to main.
 */

import * as THREE from 'three';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';

let controls;
let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;

const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();
const speed = 40.0;
const height = 1.6;

// Basic boundary for the 500x500 ground plane (centered at 0,0)
const BOUNDARY = 240; 

export function setupMovement(camera, domElement) {
    controls = new PointerLockControls(camera, domElement);

    const blocker = document.getElementById('blocker');
    const instructions = document.getElementById('instructions');

    instructions.addEventListener('click', () => {
        controls.lock();
    });

    controls.addEventListener('lock', () => {
        instructions.style.display = 'none';
        blocker.style.display = 'none';
    });

    controls.addEventListener('unlock', () => {
        blocker.style.display = 'flex';
        instructions.style.display = '';
    });

    const onKeyDown = (event) => {
        switch (event.code) {
            case 'ArrowUp':
            case 'KeyW':
                moveForward = true;
                break;
            case 'ArrowLeft':
            case 'KeyA':
                moveLeft = true;
                break;
            case 'ArrowDown':
            case 'KeyS':
                moveBackward = true;
                break;
            case 'ArrowRight':
            case 'KeyD':
                moveRight = true;
                break;
        }
    };

    const onKeyUp = (event) => {
        switch (event.code) {
            case 'ArrowUp':
            case 'KeyW':
                moveForward = false;
                break;
            case 'ArrowLeft':
            case 'KeyA':
                moveLeft = false;
                break;
            case 'ArrowDown':
            case 'KeyS':
                moveBackward = false;
                break;
            case 'ArrowRight':
            case 'KeyD':
                moveRight = false;
                break;
        }
    };

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);

    return controls;
}

export function updateMovement(delta, camera) {
    if (!controls || !controls.isLocked) return;

    // Apply damping
    velocity.x -= velocity.x * 10.0 * delta;
    velocity.z -= velocity.z * 10.0 * delta;

    direction.z = Number(moveForward) - Number(moveBackward);
    direction.x = Number(moveRight) - Number(moveLeft);
    direction.normalize();

    if (moveForward || moveBackward) velocity.z -= direction.z * speed * delta;
    if (moveLeft || moveRight) velocity.x -= direction.x * speed * delta;

    controls.moveRight(-velocity.x * delta);
    controls.moveForward(-velocity.z * delta);

    // Keep camera at fixed height (no jumping implemented)
    camera.position.y = height;

    // Simple bounds checking
    if (camera.position.x > BOUNDARY) camera.position.x = BOUNDARY;
    if (camera.position.x < -BOUNDARY) camera.position.x = -BOUNDARY;
    if (camera.position.z > BOUNDARY) camera.position.z = BOUNDARY;
    if (camera.position.z < -BOUNDARY) camera.position.z = -BOUNDARY;
}
