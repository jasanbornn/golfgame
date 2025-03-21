import * as THREE from '../../../vendor/three/build/three.module.js';
function createScene() {
    const scene = new THREE.Scene();

    scene.name = "scene";

    scene.background = new THREE.Color('skyblue');

    return scene;
}

export { createScene };
