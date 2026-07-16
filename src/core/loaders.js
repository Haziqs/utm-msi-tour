/**
 * FILE: src/core/loaders.js
 * PURPOSE: Helper to load GLTF/GLB models (e.g., the mosque model).
 * NOTE: Anyone can edit — roger in the group chat before pushing to main.
 */

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const gltfLoader = new GLTFLoader();

export function loadModel(url, onLoad, onProgress, onError) {
    gltfLoader.load(url, onLoad, onProgress, onError);
}
