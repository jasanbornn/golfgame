//out of bounds visualizing
import * as THREE from '../../../../vendor/three/build/three.module.js';

function createOutOfBoundsPlane(height) {

    const outOfBoundsGeometry = new THREE.PlaneGeometry(50, 50, 50, 50);
    outOfBoundsGeometry.rotateX(-Math.PI / 2);

    const outOfBoundsMaterial = new THREE.MeshStandardMaterial({
        wireframe: true,
        color: 'red',
        visible: false,
    });

    const outOfBoundsPlane = {
        mesh: new THREE.Mesh(outOfBoundsGeometry, outOfBoundsMaterial),
    }
    outOfBoundsPlane.mesh.position.set(0.0, height, 0.0);

    return outOfBoundsPlane;
}

export { createOutOfBoundsPlane };
