import * as THREE from '../../../vendor/three/build/three.module.js';
import * as CANNON from 'https://cdn.skypack.dev/cannon-es@0.20.0';

const GROUND_OFFSET = -0.171;

function createHole(position) {

    const numSides = 32;

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

    let body = new CANNON.Body({
        type: CANNON.Body.STATIC,
        shape: new CANNON.Box(new CANNON.Vec3(
            baseWidth / 2,
            baseHeight / 2,
            baseDepth / 2
        )),
    });

    
    
    body.material = new CANNON.Material({
        friction: 0.8,
        restitution: 0.1,
    });

    body.position.set(position.x, position.y, position.z);
    body.position.y += GROUND_OFFSET;
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
        const offset = new CANNON.Vec3(xOffset, yOffset, zOffset);
        const quaternion = childMesh.quaternion;
        const halfExtents = new CANNON.Vec3(boxWidth / 2, holeDepth / 2, boxDepth / 2);
        const boundBox = new CANNON.Box(halfExtents);
        body.addShape(boundBox, offset, quaternion);
    }

    let hole = {
        mesh: parentMesh,
        body: body,
        position: parentMesh.position,
        collideTrigger: createHoleCollideTrigger(parentMesh.position),
        inTrigger: createHoleInTrigger(parentMesh.position),
        GROUND_OFFSET: GROUND_OFFSET,
    }

    hole.mesh.name = "hole";

    return hole;
}

function createHoleCollideTrigger(holeMeshPosition) {
    //trigger visualization
    const triggerRadius = 0.11;
    const holeCollideTriggerGeometry = new THREE.SphereGeometry(triggerRadius, 32, 16);
    const holeCollideTriggerMaterial = new THREE.MeshStandardMaterial({
        color: 'red',
        wireframe: true,
        visible: false,
    });
    const holeCollideTriggerMesh = new THREE.Mesh(holeCollideTriggerGeometry, holeCollideTriggerMaterial);
    holeCollideTriggerMesh.position.copy(holeMeshPosition);
    holeCollideTriggerMesh.position.y = 
        holeMeshPosition.y - 
        GROUND_OFFSET -
        0.01;

    //trigger body
    const holeCollideTriggerBody = new CANNON.Body({
        type: CANNON.Body.STATIC,
        isTrigger: true,
        shape: new CANNON.Sphere(triggerRadius),
    });

    holeCollideTriggerBody.position.copy(holeCollideTriggerMesh.position);

    const holeCollideTrigger = {
        mesh: holeCollideTriggerMesh,
        body: holeCollideTriggerBody,
    };

    return holeCollideTrigger;

}

function createHoleInTrigger(holeMeshPosition) {
    //trigger visualization
    const triggerRadius = 0.11;
    const triggerHeight = 0.05;
    const holeInTriggerGeometry = new THREE.CylinderGeometry(
        triggerRadius,
        triggerRadius,
        triggerHeight,
    );
    const holeInTriggerMaterial = new THREE.MeshStandardMaterial({
        color: 'red',
        wireframe: true,
        visible: false,
    });
    const holeInTriggerMesh = new THREE.Mesh(holeInTriggerGeometry, holeInTriggerMaterial);
    holeInTriggerMesh.position.copy(holeMeshPosition);
    holeInTriggerMesh.position.y =
        holeMeshPosition.y -
        GROUND_OFFSET -
        0.1;

    //trigger body
    const holeInTriggerBody = new CANNON.Body({
        type: CANNON.Body.STATIC,
        isTrigger: true,
        shape: new CANNON.Cylinder(
            triggerRadius,
            triggerRadius,
            triggerHeight,
        ),
    });

    holeInTriggerBody.position.copy(holeInTriggerMesh.position);

    const holeInTrigger = {
        mesh: holeInTriggerMesh,
        body: holeInTriggerBody,
    };

    return holeInTrigger;
}

export { createHole }; 
