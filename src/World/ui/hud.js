import * as THREE from '../../../vendor/three/build/three.module.js';

function createHud() {
    //autostart = false
    const clock = new THREE.Clock(false);

    const strikeMeterContainer = document.getElementById("strike-meter-container");
    const strikeMeterValue = document.getElementById("strike-meter-value");
    const holeInfoContainer = document.getElementById("hole-info-container");
    const scorecardButtonsContainer = document.getElementById("scorecard-and-buttons-container");

    const strokesNumberText = document.getElementById("strokes-number-text");
    const strokesLabelText = document.getElementById("strokes-label-text");
    const holeNumberText = document.getElementById("hole-full-text");
    const parNumberText = document.getElementById("par-full-text");

    const scorecardToggleButton = document.getElementById("scorecard-toggle-button");
    const openMenuButton = document.getElementById("open-menu-button");

    const hud = {
        state: "inactive",
    };

    const setStrikePowerBarValue = (value) => {
        strikeMeterValue.style.height = value.toFixed(0) + "%";
    };

    hud.setState = (state) => {
        hud.state = state;
        switch(state) {
            case "active":
                strikeMeterContainer.style.display = "inline";
                holeInfoContainer.style.display = "flex";
                scorecardButtonsContainer.style.display = "flex";
                break;
            case "inactive":
                strikeMeterContainer.style.display = "none";
                holeInfoContainer.style.display = "none";
                scorecardButtonsContainer.style.display = "none";
                break;
            default:
                strikeMeterContainer.style.display = "none";
                holeInfoContainer.style.display = "none";
                scorecardButtonsContainer.style.display = "none";
                break;
        }
    }

    hud.toggle = () => {
        if(hud.state == "active") {
            hud.setState("inactive");
        } else {
            hud.setState("active");
        }
    }

    hud.setStrokesText = (value) => {
        strokesNumberText.textContent = value.toFixed(0); 
        if(value == 1) {
            strokesLabelText.textContent = "stroke";
        } else {
            strokesLabelText.textContent = "strokes";
        }
    };

    hud.setParText = (value) => {
        parNumberText.textContent = "Par " + value.toFixed(0);
    };

    hud.setHoleNumberText = (value) => {
        holeNumberText.textContent = "Hole " + value.toFixed(0);
    };

    hud.pullStrikePowerPercent = () => {};

    hud.disableBottomButtons = () => {
        scorecardToggleButton.disabled = true;
        openMenuButton.disabled = true;
    }

    hud.enableBottomButtons = () => {
        clock.start();
    }

    hud.tick = () => {
        const strikePower = hud.pullStrikePowerPercent() * 100;
        setStrikePowerBarValue(strikePower);

        if(clock.getElapsedTime() >= 0.5) {
            //enable bottom buttons
            scorecardToggleButton.disabled = false;
            openMenuButton.disabled = false;
            clock.start();
            clock.stop();
        }
    };

    return hud;
}

export { createHud };
