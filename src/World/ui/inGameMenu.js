function createInGameMenu() {

    const mainMenuDiv = document.getElementById("in-game-menu")
    const resumeButton = document.getElementById("resume-button");
    const restartButton = document.getElementById("restart-button");
    const levelsButton = document.getElementById("levels-button");
    const optionsButton = document.getElementById("options-button");

    const levelsMenuDiv = document.getElementById("levels-menu");
    const levelsBackButton = document.getElementById("levels-back-button");

    const inGameMenu = {
        state: "closed",

        //expose buttons to World.js
        restartButton: restartButton,

    };

    inGameMenu.setState = (state) => {
        inGameMenu.state = state;
        switch(state) {
            case "main-menu":
                mainMenuDiv.style.display = "flex";
                levelsMenuDiv.style.display = "none";
                break;
            case "levels-menu":
                levelsMenuDiv.style.display = "flex";
                mainMenuDiv.style.display = "none";
                break;
            case "closed":
                levelsMenuDiv.style.display = "none";
                mainMenuDiv.style.display = "none";
                break;
            default:
                inGameMenu.state = "closed";
                levelsMenuDiv.style.display = "none";
                mainMenuDiv.style.display = "none";
        }
    }

    inGameMenu.toggle = () => {
        if(inGameMenu.state === "closed") {
            inGameMenu.setState("main-menu");
        } else {
            inGameMenu.setState("closed");
        }
    }

    resumeButton.onclick = inGameMenu.toggle;
    levelsButton.onclick = () => { inGameMenu.setState("levels-menu"); }
    levelsBackButton.onclick = () => { inGameMenu.setState("main-menu"); }

    return inGameMenu;
}

export { createInGameMenu };
