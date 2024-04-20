import * as THREE from '../../../vendor/three/build/three.module.js';
function createLights() {
    // create a directional light
    const light = new THREE.DirectionalLight(
        'white', //color
        8 //intensity
    );

    light.castShadow = true;

    // position the light
    light.position.set(10, 10, 10);

    return light;
}

export { createLights };
