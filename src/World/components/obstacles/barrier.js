import * as THREE from '../../../../vendor/three/build/three.module.js';
import * as CANNON from 'https://cdn.skypack.dev/cannon-es@0.20.0';

function createBarrier(width, position, quaternion, isPushedBack) {
    const barrierHeight = 0.1;
    const barrierDepth = 0.05;
    let barrierWidth = width;

    const textureLoader = new THREE.TextureLoader();
    textureLoader.path = 'putt';
    const createMaterial = () => {
        textureLoader.load(
            '/../assets/wood.jpg',
            (texture) => {
                barrier.mesh.material = new THREE.MeshStandardMaterial({
                    color: 0x654321,
                    map: texture,
                });
            },
        );

        textureLoader.load(
            '/../assets/wood_norm.jpg',
            (texture) => {
                barrier.mesh.material.normalMap = texture;
            },
        );
    }

    if(isPushedBack === undefined || isPushedBack === null) {
        isPushedBack = true;
    }

    const geometry = new THREE.BoxGeometry(barrierWidth, barrierHeight, barrierDepth);
    const material = new THREE.MeshStandardMaterial({
        color: 0x654321,  
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
    };
    createMaterial();

    barrier.mesh.name = "barrier";

    barrier.mesh.position.copy(position);
    barrier.mesh.quaternion.copy(quaternion);

    barrier.mesh.translateY(barrierHeight / 2);
    if(isPushedBack) {
        barrier.mesh.translateZ(-barrierDepth / 2);
    }

    barrier.body.position.copy(barrier.mesh.position);
    barrier.body.quaternion.copy(barrier.mesh.quaternion);

    barrier.body.material = new CANNON.Material({
        friction: 0.6,
        restitution: 0.8,
    });

    return barrier;
}

export { createBarrier };
