import * as THREE from '../../../../vendor/three/build/three.module.js';

function createSpinningBall(position) {

    const textureLoader = new THREE.TextureLoader();
    const createMaterial = () => {
        ball.mesh.material = new THREE.MeshPhysicalMaterial({
            normalScale: new THREE.Vector3(1.0, 1.0),
            roughness: 0.0,
            clearcoat: 1.0,
            metalness: 0.7,
        });
        ball.mesh.material.normalMap = textureLoader.load('assets/golfball.jpg');
        ball.mesh.name = "spinning-ball";
    };

    const radius = 1.0; //meters
    const widthSegments = 32;
    const heightSegments = 16;
    const geometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments);
    const material = new THREE.MeshStandardMaterial();

    const ball = {
        mesh: new THREE.Mesh(geometry, material),
    };
    ball.mesh.position.copy(position);
    createMaterial();

    ball.tick = (delta) => {
        ball.mesh.rotateY(0.2 * delta);
    };

    return ball;
}

export { createSpinningBall };
