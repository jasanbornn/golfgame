import * as THREE from '../../../../vendor/three/build/three.module.js';

import { createLight } from '../../components/light.js';
import { createGround } from '../../components/ground.js';

import { createSpinningBall } from './createSpinningBall.js';

function createMainMenu() {

    const mainMenuDiv = document.getElementById("main-menu");
    const playButton = document.getElementById("play-button");

    const mainMenu = {
        state: "active",
        playButton: playButton,
    };

    const spinningBall = createSpinningBall(new THREE.Vector3(0.0, 0.0, 2.75));
    const menuDirectLighting = createLight(new THREE.Vector3(-0.0, 5.0, -4.0));
    const menuAmbientLighting = new THREE.AmbientLight(0x809080, 1.0);
    const ground = createGround(
        50,
        50,
        new THREE.Vector3(0.0, -1.0, 0.0),
        new THREE.Quaternion().setFromAxisAngle(
            new THREE.Vector3(0.0, 0.0, 0.0),
            0,
        ),
    );

    mainMenu.menuObjects = [
        spinningBall, 
        menuDirectLighting,
        menuAmbientLighting,
        ground,
    ];

    mainMenu.spinningBall = spinningBall;

    mainMenu.setState = (state) => {
        mainMenu.state = state;
        switch(state) {
            case "active":
                mainMenuDiv.style.display = "flex";
                break;
            case "inactive":
                mainMenuDiv.style.display = "none";
                break;
            default:
                mainMenuDiv.style.display = "flex";
        }
    }

    return mainMenu;
}

export { createMainMenu };
