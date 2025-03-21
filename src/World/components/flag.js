import * as THREE from '../../../vendor/three/build/three.module.js';
import * as CANNON from 'https://cdn.skypack.dev/cannon-es@0.20.0';

function createFlag(position) {
    const poleRadius = 0.020; //meters
    const poleHeight = 1.5;
    const poleRadialSegments = 16;
    const poleHeightSegments = 1;
    const poleGeometry = new THREE.CylinderGeometry(
        poleRadius,
        poleRadius,
        poleHeight,
        poleRadialSegments,
        poleHeightSegments
    );
    poleGeometry.translate(
        0, 
        (poleHeight / 2) - (poleHeight * 0.1),
        0
    );
    const poleMaterial = new THREE.MeshStandardMaterial({
        color: 'white',
    });

    const poleMesh = new THREE.Mesh(poleGeometry, poleMaterial);

    const flagShape = new THREE.Shape();
    const flagWidth = 0.30;
    const flagHeight = 0.15;
    const flagDepth = 0.002;
    flagShape.moveTo(0, 0);
    flagShape.lineTo(flagWidth, flagHeight / 2)
    flagShape.lineTo(0, flagHeight);
    flagShape.lineTo(0, 0);

    const extrudeSettings = {
        depth: flagDepth,
        bevelEnabled: false,
    }

    const flagGeometry = new THREE.ExtrudeGeometry(flagShape, extrudeSettings);
    flagGeometry.translate(
        0,
        (poleHeight * 0.9) - flagHeight,
        0
    );
    const flagMaterial = new THREE.MeshStandardMaterial({
        color: 'red',
    });

    const flagMesh = new THREE.Mesh(flagGeometry, flagMaterial);

    //grouping flag and pole together; 
    //setting pole as parent mesh for flag
    poleMesh.add(flagMesh);

    const flag = {
        mesh: poleMesh
    };

    flag.mesh.name = "flag";

    flag.mesh.position.copy(position);

    return flag;
}

export { createFlag };
