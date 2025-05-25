import * as THREE from '../../../vendor/three/build/three.module.js';
import * as CANNON from 'https://cdn.skypack.dev/cannon-es@0.20.0';

const GROUND_OFFSET = -0.171;

function createCup(position) {

    const numSides = 32;

    const materialSpec = {
        color: 0x999999,
    };

    let radius = 0.11;
    let cupDepth = 0.12;

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
    const yOffset = (baseHeight / 2) + (cupDepth / 2);
    for(let i = 0; i < numSides; i++) {

        const xOffset = (radius + boxDepth/2)*Math.cos(i*dTheta);
        const zOffset = (radius + boxDepth/2)*Math.sin(i*dTheta);

        //generate mesh for rendering bound box
        const geometry = new THREE.BoxGeometry(boxWidth, cupDepth, boxDepth);
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
        const halfExtents = new CANNON.Vec3(boxWidth / 2, cupDepth / 2, boxDepth / 2);
        const boundBox = new CANNON.Box(halfExtents);
        body.addShape(boundBox, offset, quaternion);
    }

    let cup = {
        mesh: parentMesh,
        body: body,
        position: parentMesh.position,
        collideTrigger: createCupCollideTrigger(parentMesh.position),
        inTrigger: createCupInTrigger(parentMesh.position),
        GROUND_OFFSET: GROUND_OFFSET,
    }

    cup.mesh.name = "cup";

    return cup;
}

function createCupCollideTrigger(cupMeshPosition) {
    //trigger visualization
    const triggerRadius = 0.11;
    const cupCollideTriggerGeometry = new THREE.SphereGeometry(triggerRadius, 32, 16);
    const cupCollideTriggerMaterial = new THREE.MeshStandardMaterial({
        color: 'red',
        wireframe: true,
        visible: false,
    });
    const cupCollideTriggerMesh = new THREE.Mesh(cupCollideTriggerGeometry, cupCollideTriggerMaterial);
    cupCollideTriggerMesh.position.copy(cupMeshPosition);
    cupCollideTriggerMesh.position.y = 
        cupMeshPosition.y - 
        GROUND_OFFSET -
        0.01;

    //trigger body
    const cupCollideTriggerBody = new CANNON.Body({
        type: CANNON.Body.STATIC,
        isTrigger: true,
        shape: new CANNON.Sphere(triggerRadius),
    });

    cupCollideTriggerBody.position.copy(cupCollideTriggerMesh.position);

    const cupCollideTrigger = {
        mesh: cupCollideTriggerMesh,
        body: cupCollideTriggerBody,
    };

    return cupCollideTrigger;

}

function createCupInTrigger(cupMeshPosition) {
    //trigger visualization
    const triggerRadius = 0.11;
    const triggerHeight = 0.05;
    const cupInTriggerGeometry = new THREE.CylinderGeometry(
        triggerRadius,
        triggerRadius,
        triggerHeight,
    );
    const cupInTriggerMaterial = new THREE.MeshStandardMaterial({
        color: 'red',
        wireframe: true,
        visible: false,
    });
    const cupInTriggerMesh = new THREE.Mesh(cupInTriggerGeometry, cupInTriggerMaterial);
    cupInTriggerMesh.position.copy(cupMeshPosition);
    cupInTriggerMesh.position.y =
        cupMeshPosition.y -
        GROUND_OFFSET -
        0.1;

    //trigger body
    const cupInTriggerBody = new CANNON.Body({
        type: CANNON.Body.STATIC,
        isTrigger: true,
        shape: new CANNON.Cylinder(
            triggerRadius,
            triggerRadius,
            triggerHeight,
        ),
    });

    cupInTriggerBody.position.copy(cupInTriggerMesh.position);

    const cupInTrigger = {
        mesh: cupInTriggerMesh,
        body: cupInTriggerBody,
    };

    return cupInTrigger;
}

export { createCup }; 
