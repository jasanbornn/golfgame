function createInGameMenu() {

    const mainMenuDiv = document.getElementById("in-game-menu")
    const resumeButton = document.getElementById("resume-button");
    const restartButton = document.getElementById("restart-button");
    const levelsButton = document.getElementById("levels-button");
    const optionsButton = document.getElementById("options-button");
    const quitButton = document.getElementById("menu-quit-button");

    const menuButton = document.getElementById("open-menu-button");

    const menuScreenDim = document.getElementById("menu-screen-dim");

    const levelsMenuDiv = document.getElementById("levels-menu");
    const levelsBackButton = document.getElementById("levels-back-button");

    const levelBoxes = [
        document.getElementById("level-box-1"),
        document.getElementById("level-box-2"),
        document.getElementById("level-box-3"),
        document.getElementById("level-box-4"),
        document.getElementById("level-box-5"),
        document.getElementById("level-box-6"),
        document.getElementById("level-box-7"),
        document.getElementById("level-box-8"),
        document.getElementById("level-box-9"),
    ];

    const inGameMenu = {
        state: "closed",
        //expose buttons and divs to World.js
        restartButton: restartButton,
        quitButton: quitButton,
        levelBoxes: levelBoxes,
    };

    inGameMenu.setState = (state) => {
        inGameMenu.state = state;
        switch(state) {
            case "main-menu":
                mainMenuDiv.style.display = "flex";
                levelsMenuDiv.style.display = "none";
                menuScreenDim.style.display = "inline";
                break;
            case "levels-menu":
                levelsMenuDiv.style.display = "flex";
                mainMenuDiv.style.display = "none";
                menuScreenDim.style.display = "inline";
                break;
            case "closed":
                levelsMenuDiv.style.display = "none";
                mainMenuDiv.style.display = "none";
                menuScreenDim.style.display = "none";
                break;
            default:
                inGameMenu.setState("closed");
        }
    };

    inGameMenu.toggle = () => {
        if(inGameMenu.state === "closed") {
            inGameMenu.setState("main-menu");
        } else {
            inGameMenu.setState("closed");
        }
    };

    menuButton.onclick = inGameMenu.toggle;
    resumeButton.onclick = inGameMenu.toggle;
    levelsButton.onclick = () => { inGameMenu.setState("levels-menu"); };
    levelsBackButton.onclick = () => { inGameMenu.setState("main-menu"); };

    return inGameMenu;
}

export { createInGameMenu };
