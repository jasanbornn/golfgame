import * as THREE from '../../../vendor/three/build/three.module.js';
import { Body, Sphere } from 'https://cdn.skypack.dev/cannon-es@0.20.0';

import { CSG } from '../../../vendor/three-csg/three-csg.js';


function createHoleTrigger(targetHole) {
    //trigger
    const triggerRadius = 0.3;
    const holeTriggerGeometry = new THREE.SphereGeometry(triggerRadius, 32, 16);
    const holeTriggerMaterial = new THREE.MeshStandardMaterial({
        color: 'red',
    });
    const holeTriggerMesh = new THREE.Mesh(holeTriggerGeometry, holeTriggerMaterial);
    holeTriggerMesh.position.copy(targetHole.mesh.position);
    holeTriggerMesh.position.y = 
        targetHole.mesh.position.y - 
        targetHole.GROUND_OFFSET -
        0.01;

    //trigger body
    const holeTriggerBody = new Body({
        type: Body.STATIC,
        isTrigger: true,
        shape: new Sphere(triggerRadius),
    });

    holeTriggerBody.position.copy(holeTriggerMesh.position);

    const holeTrigger = {
        mesh: holeTriggerMesh,
        body: holeTriggerBody,
    };

    return holeTrigger;

}

export { createHoleTrigger };

