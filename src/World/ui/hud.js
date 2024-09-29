function createHud() {
    const strikePowerBar = document.getElementById("strike-meter-value");
    const strokesText = document.getElementById("strokes-value-text");
    const parText = document.getElementById("par-value-text");
    
    const hud = {};

    const setStrikePowerBarValue = (value) => {
        strikePowerBar.style.height = value.toFixed(0) + "%";
    };

    hud.setStrokesText = (value) => {
        if(value == 1) {
            strokesText.textContent = value.toFixed(0) + " stroke";
        } else {
            strokesText.textContent = value.toFixed(0) + " strokes";
        }

    };

    hud.setParText = (value) => {
        parText.textContent = "Par " + value.toFixed(0);
    };

    hud.pullStrikePowerPercent = () => {};

    hud.tick = () => {
        const strikePower = hud.pullStrikePowerPercent() * 100;
        setStrikePowerBarValue(strikePower);
    };

    return hud;
}

export { createHud };
