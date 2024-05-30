import * as THREE from '../../../vendor/three/build/three.module.js';
import { Body, Box, Plane, Vec3 } from 'https://cdn.skypack.dev/cannon-es@0.20.0';

function createHole(numSides) {

    const GROUND_OFFSET = -0.171;

    const materialSpec = {
        color: 0x999999,
    };

    let radius = 0.11;
    let holeDepth = 0.12;

    const baseWidth = radius*2;
    const baseHeight = 0.1;
    const baseDepth = radius*2;

    const parentGeometry = new THREE.BoxGeometry(baseWidth, baseHeight, baseDepth);
    const parentMaterial = new THREE.MeshStandardMaterial(materialSpec);
    let parentMesh = new THREE.Mesh(parentGeometry, parentMaterial);

    let body = new Body({
        type: Body.STATIC,
        shape: new Box(new Vec3(baseWidth / 2, baseHeight / 2, baseDepth / 2)),
    });

    body.position.set(0, GROUND_OFFSET, -4);
    parentMesh.position.copy(body.position);

    const boxWidth = 3.5 * radius;
    const boxDepth = 0.05;

    const dTheta = (2 * Math.PI) / numSides;
    //const yOffset = baseHeight / 2;
    const yOffset = (baseHeight / 2) + (holeDepth / 2);
    for(let i = 0; i < numSides; i++) {

        const xOffset = (radius + boxDepth/2)*Math.cos(i*dTheta);
        const zOffset = (radius + boxDepth/2)*Math.sin(i*dTheta);

        //generate mesh for rendering bound box
        const geometry = new THREE.BoxGeometry(boxWidth, holeDepth, boxDepth);
        const material = new THREE.MeshStandardMaterial(materialSpec);
        const childMesh = new THREE.Mesh(geometry, material);
        childMesh.translateX(xOffset);
        childMesh.translateZ(zOffset);
        childMesh.lookAt(new THREE.Vector3(0, 0, 0));
        childMesh.translateY(yOffset);
        parentMesh.add(childMesh);

        //generate physical bound box
        const offset = new Vec3(xOffset, yOffset, zOffset);
        const quaternion = childMesh.quaternion;
        const halfExtents = new Vec3(boxWidth / 2, holeDepth / 2, boxDepth / 2);
        const boundBox = new Box(halfExtents);
        body.addShape(boundBox, offset, quaternion);
    }

    return {
        mesh: parentMesh,
        body: body,
        GROUND_OFFSET: GROUND_OFFSET,
    };
}

export { createHole }; 
