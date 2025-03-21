import * as THREE from '../../../vendor/three/build/three.module.js';
function createLight(position) {
    // create a directional light
    const light = new THREE.DirectionalLight(
        'white', //color
        6.0 //intensity
    );

    light.name = "light";

    // position the light
    light.position.copy(position);

    return light;
}

export { createLight };
