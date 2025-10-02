import * as THREE from '../../../../vendor/three/build/three.module.js';

import { createLight } from '../../components/light.js';
import { createGround } from '../../components/ground.js';

import { createSpinningBall } from './createSpinningBall.js';

function createMainMenu() {

    const mainMenuDiv = document.getElementById("main-menu");
    const playButton = document.getElementById("main-menu-play-button");
    const githubButton = document.getElementById("main-menu-github-button");

    const leaderboard = document.getElementById("main-menu-leaderboard");

    const xhr = new XMLHttpRequest();

    const mainMenu = {
        state: "active",
        playButton: playButton,
        githubButton: githubButton,
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

    mainMenu.setLeaderboardContent = (content) => {
        leaderboard.innerHTML = content;
    };

    //https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest_API
    mainMenu.queryLeaderboard = () => {
        xhr.open("POST", "../php/leaderboard_report.php");
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhr.send();
    }

    const DONE = 4;
    const HTTP_OK = 200;
    xhr.onreadystatechange = () => {
        if(xhr.readyState == DONE) {
            if(xhr.status == HTTP_OK) {
                if(xhr.responseText[0] == '<') {
                    mainMenu.setLeaderboardContent(xhr.responseText);
                } else if(xhr.responseText[0] == '\n') {
                    console.log("Submit response: " + xhr.responseText);
                    mainMenu.setState("quitting");
                    mainMenu.queryLeaderboard();
                } else if(xhr.responseText == "") {
                    console.log("Null XHR response");
                    mainMenu.setLeaderboardContent("<p>no scores</p>");
                } else {
                    console.log("Other XHR response: " + xhr.responseText);
                }
            } else {
                console.log("Error fetching scores. status: " + xhr.status);
            }
        }
    };

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
