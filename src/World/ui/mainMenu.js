function createMainMenu() {


    const mainMenuDiv = document.getElementById("main-menu");
    const playButton = document.getElementById("play-button");
   
    const mainMenu = {
        state: "active",
        playButton: playButton,
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
