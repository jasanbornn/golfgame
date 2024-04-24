import * as THREE from '../../../vendor/three/build/three.module.js';
import { CSG } from '../../../vendor/three-csg/three-csg.js';

function createPlaneClip(targetPlane, targetHole) {
    const planeClipGeometry = new THREE.CylinderGeometry(0.112, 0.112, 0.5, 32);
    const planeClipMaterial = new THREE.MeshStandardMaterial({
        color: 'red',
    });
    const planeClipMesh = new THREE.Mesh(planeClipGeometry, planeClipMaterial);
    planeClipMesh.position.copy(targetHole.mesh.position);
    planeClipMesh.position.y = targetPlane.mesh.position.y;

    //cut a hole in the ground ("plane") using geometry subtraction
    targetPlane.mesh.updateMatrix();
    planeClipMesh.updateMatrix();
    const planeBSP = CSG.fromMesh( targetPlane.mesh );
    const planeClipBSP = CSG.fromMesh( planeClipMesh );
    const planeResultBSP = planeBSP.subtract(planeClipBSP);
    const planeResultMesh = CSG.toMesh( planeResultBSP, targetPlane.mesh.matrix, targetPlane.mesh.material);

    const planeClip = {
        mesh: planeResultMesh,
    };

    return planeClip;

}

export { createPlaneClip };
