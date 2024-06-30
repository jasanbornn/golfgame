import * as THREE from '../../../../vendor/three/build/three.module.js';
import * as CANNON from 'https://cdn.skypack.dev/cannon-es@0.20.0';

function createBarrier(width) {
    const barrierWidth = width;
    const barrierHeight = 0.2;
    const barrierDepth = barrierHeight;

    const geometry = new THREE.BoxGeometry(barrierWidth, barrierHeight, barrierDepth);
    const material = new THREE.MeshStandardMaterial({
        color: 'brown',  
    });

    const barrierHalfExtents = new CANNON.Vec3(
        barrierWidth / 2,
        barrierHeight / 2,
        barrierDepth / 2,
    );
    const barrier = {
        mesh: new THREE.Mesh(geometry, material),
        body: new CANNON.Body({
            type: CANNON.STATIC,
            shape: new CANNON.Box(barrierHalfExtents),
        }),
        setPosition: function(x, y, z) {
            this.mesh.position.set(x, y, z);
            this.mesh.translateY(barrierHeight / 2);
            this.mesh.translateZ(-barrierHeight / 2);
            this.body.position.copy(this.mesh.position);
        },
        setQuaternion: function(x, y, z, w) {
            this.mesh.quaternion.set(x, y, z, w);
            this.mesh.quaternion.normalize();
            this.body.quaternion.copy(this.mesh.quaternion);
        },
        setPhysMaterial: function(material) {
            this.body.material = material;
        },
    }
    barrier.mesh.position.set(0, 0, 0);
    barrier.body.position.copy(barrier.mesh.position);

    return barrier;
}

export { createBarrier };
