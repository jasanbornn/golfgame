import * as THREE from '../../../vendor/three/build/three.module.js';

function createContinueButton() {

    //autostart = false;
    const clock = new THREE.Clock(false);

    const continueButtonDiv = document.getElementById("continue-button");

    const continueButton = {};

    continueButton.show = () => {
        continueButtonDiv.style.display = "flex";
        continueButtonDiv.style.pointerEvents = "auto";
    }

    continueButton.hide = () => {
        continueButtonDiv.style.display = "none";
        continueButtonDiv.style.pointerEvents = "none";
    }

    continueButton.setOnClick = (func) => {
        continueButtonDiv.onclick = () => {
            func();
        }
    }

    //together with continueButton.tick:
    //displays the button after a set delay
    continueButton.prompt = () => {
        clock.start();
    }

    continueButton.tick = () => {
        if(clock.getElapsedTime() > 2.0) {
            continueButtonDiv.style.display = "flex";
            continueButtonDiv.style.pointerEvents = "auto";
            clock.start();
            clock.stop();
        }
    }

    continueButtonDiv.onclick = () => {};

    return continueButton;
}

export { createContinueButton };
