/**
 * FILE: src/controls/movement.js
 * PURPOSE: First-person WASD + mouse with SPACE (UP), SHIFT (DOWN), and Q (SPRINT).
 * STYLE: Minecraft creative mode — no gravity, free floating.
 */

import * as THREE from 'three';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';

let controls;
let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
let moveUp = false;
let moveDown = false;
let isSprinting = false;

const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();
const baseSpeed = 40.0;
const sprintMultiplier = 2.8;
const verticalSpeed = 20.0;
const BOUNDARY = 240;

// ---- COLLISION STATE ----

let collidableObjects = [];
const COLLISION_RADIUS = 1.5;
const collisionRaycaster = new THREE.Raycaster();
export function setCollidables(objects) {
    collidableObjects = objects;
}
function resolveAxisMove(from, to) {
    if (collidableObjects.length === 0) return to;

    const movement = new THREE.Vector3().subVectors(to, from);
    const distance = movement.length();
    if (distance < 1e-5) return to;

    const dir = movement.clone().normalize();
    collisionRaycaster.set(from, dir);
    collisionRaycaster.near = 0;
    collisionRaycaster.far = distance + COLLISION_RADIUS;

    const hits = collisionRaycaster.intersectObjects(collidableObjects, true);
    if (hits.length > 0 && hits[0].distance < distance + COLLISION_RADIUS) {
        const safeDistance = Math.max(hits[0].distance - COLLISION_RADIUS, 0);
        return from.clone().addScaledVector(dir, safeDistance);
    }
    return to;
}
export function setupMovement(camera, domElement) {
    controls = new PointerLockControls(camera, domElement);
    window.__controls = controls;

    const blocker = document.getElementById('blocker');
    const instructions = document.getElementById('instructions');

    if (!blocker || !instructions) {
        console.warn('⚠️ Blocker or instructions element not found!');
        return controls;
    }

    instructions.addEventListener('click', () => controls.lock());
    blocker.addEventListener('click', () => controls.lock());

    controls.addEventListener('lock', () => {
        instructions.style.display = 'none';
        blocker.style.display = 'none';
        // Hide info panel if it's open when user clicks to lock again
        const infoPanel = document.getElementById('info-panel');
        if (infoPanel) infoPanel.style.display = 'none';
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
            case 'Space':
                moveUp = true;
                event.preventDefault();
                break;
            case 'ShiftLeft':
            case 'ShiftRight':
                moveDown = true;
                break;
            case 'KeyQ':
                isSprinting = true;
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
            case 'Space':
                moveUp = false;
                break;
            case 'ShiftLeft':
            case 'ShiftRight':
                moveDown = false;
                break;
            case 'KeyQ':
                isSprinting = false;
                break;
        }
    };

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);

    return controls;
}

export function updateMovement(delta, camera) {
    if (!controls || !controls.isLocked) return;

    // Determine current speed (with sprint)
    const currentSpeed = isSprinting ? baseSpeed * sprintMultiplier : baseSpeed;

    // Horizontal movement
    velocity.x -= velocity.x * 10.0 * delta;
    velocity.z -= velocity.z * 10.0 * delta;

    direction.z = Number(moveForward) - Number(moveBackward);
    direction.x = Number(moveRight) - Number(moveLeft);
    direction.normalize();

    if (moveForward || moveBackward) velocity.z -= direction.z * currentSpeed * delta;
    if (moveLeft || moveRight) velocity.x -= direction.x * currentSpeed * delta;


    let beforeStep = camera.position.clone();
    controls.moveRight(-velocity.x * delta);
    let afterStep = resolveAxisMove(beforeStep, camera.position.clone());
    camera.position.copy(afterStep);

    beforeStep = camera.position.clone();
    controls.moveForward(-velocity.z * delta);
    afterStep = resolveAxisMove(beforeStep, camera.position.clone());
    camera.position.copy(afterStep);

    // Vertical movement (SPACE = UP, SHIFT = DOWN) — No gravity
    if (moveUp) {
        camera.position.y += verticalSpeed * delta;
    }
    if (moveDown) {
        camera.position.y -= verticalSpeed * delta;
    }

    // Boundary check (X and Z only — Y is free)
    if (camera.position.x > BOUNDARY) camera.position.x = BOUNDARY;
    if (camera.position.x < -BOUNDARY) camera.position.x = -BOUNDARY;
    if (camera.position.z > BOUNDARY) camera.position.z = BOUNDARY;
    if (camera.position.z < -BOUNDARY) camera.position.z = -BOUNDARY;
}

