import * as THREE from '../../../vendor/three/build/three.module.js';
function createLights() {
    // create a directional light
    const light = new THREE.DirectionalLight(
        'white', //color
        8.0 //intensity
    );

    light.castShadow = true;

    // position the light
    light.position.set(10, 10, 20);

    return light;
}

export { createLights };
