import { BoxBufferGeometry, Mesh, MeshStandardMaterial, Vector3} from 'https://cdn.skypack.dev/three@0.132.2';
import { Body, Box, Plane, Vec3 } from 'https://cdn.skypack.dev/cannon-es@0.20.0';

function createHole(numSides) {

    const GROUND_OFFSET = -0.18;

    const materialSpec = {
        color: 'green' 
    };

    let radius = 0.11;
    let holeDepth = 0.12;

    const baseWidth = radius*4;
    const baseHeight = 0.1;
    const baseDepth = radius*4;

    const parentGeometry = new BoxBufferGeometry(baseWidth, baseHeight, baseDepth);
    const parentMaterial = new MeshStandardMaterial(materialSpec);
    let parentMesh = new Mesh(parentGeometry, parentMaterial);

    let body = new Body({
        type: Body.STATIC,
        shape: new Box(new Vec3(baseWidth / 2, baseHeight / 2, baseDepth / 2)),
    });

    body.position.set(1, GROUND_OFFSET, -3);
    //body.position.set(1, 1, -5);
    parentMesh.position.copy(body.position);

    const boxWidth = 3.5*radius;
    const boxDepth = 0.5;

    const dTheta = (2 * Math.PI) / numSides;
    //const yOffset = baseHeight / 2;
    const yOffset = (baseHeight / 2) + (holeDepth / 2);
    for(let i = 0; i < numSides; i++) {

        const xOffset = (radius + boxDepth/2)*Math.cos(i*dTheta);
        const zOffset = (radius + boxDepth/2)*Math.sin(i*dTheta);


        //generate mesh for rendering bound box
        const geometry = new BoxBufferGeometry(boxWidth, holeDepth, boxDepth);
        const material = new MeshStandardMaterial(materialSpec);
        const childMesh = new Mesh(geometry, material);
        childMesh.translateX(xOffset);
        childMesh.translateZ(zOffset);
        childMesh.lookAt(new Vector3(0, 0, 0));
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
