function createInGameMenu() {

    const inGameMenuDiv = document.getElementById("in-game-menu")
    const resumeButton = document.getElementById("resume-button");
    const optionsButton = document.getElementById("options-button");
    const optionsBackButton = document.getElementById("options-back-button");
    const levelsButton = document.getElementById("levels-button");
    const levelsBackButton = document.getElementById("levels-back-button");
    const quitButton = document.getElementById("menu-quit-button");

    const menuButton = document.getElementById("open-menu-button");

    const menuScreenDim = document.getElementById("menu-screen-dim");

    const optionsMenuDiv = document.getElementById("options-menu");
    const treesCheckbox = document.getElementById("trees-checkbox");

    const levelsMenuDiv = document.getElementById("levels-menu");
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
        quitButton: quitButton,
        levelBoxes: levelBoxes,
    };

    inGameMenu.setState = (state) => {
        inGameMenu.state = state;
        switch(state) {
            case "main":
                inGameMenuDiv.style.display = "flex";
                optionsMenuDiv.style.display = "none";
                levelsMenuDiv.style.display = "none";
                menuScreenDim.style.display = "inline";
                break;
            case "options-menu":
                levelsMenuDiv.style.display = "none";
                optionsMenuDiv.style.display = "flex";
                inGameMenuDiv.style.display = "none";
                menuScreenDim.style.display = "inline";
                break;
            case "levels-menu":
                levelsMenuDiv.style.display = "flex";
                optionsMenuDiv.style.display = "none";
                inGameMenuDiv.style.display = "none";
                menuScreenDim.style.display = "inline";
                break;
            case "closed":
                levelsMenuDiv.style.display = "none";
                optionsMenuDiv.style.display = "none";
                inGameMenuDiv.style.display = "none";
                menuScreenDim.style.display = "none";
                break;
            default:
                inGameMenu.setState("closed");
        }
    };

    inGameMenu.toggle = () => {
        if(inGameMenu.state === "closed") {
            inGameMenu.setState("main");
        } else {
            inGameMenu.setState("closed");
        }
    };

    menuButton.onclick = inGameMenu.toggle;
    resumeButton.onclick = inGameMenu.toggle;
    optionsButton.onclick = () => { inGameMenu.setState("options-menu"); };
    optionsBackButton.onclick = () => { inGameMenu.setState("main"); };
    levelsButton.onclick = () => { inGameMenu.setState("levels-menu"); };
    levelsBackButton.onclick = () => { inGameMenu.setState("main"); };

    treesCheckbox.addEventListener("change", (event) => { 
        if(event.currentTarget.checked) {
            inGameMenu.changeOption("trees", false);
        } else {
            inGameMenu.changeOption("trees", true);
        }
    });

    return inGameMenu;
}

export { createInGameMenu };
