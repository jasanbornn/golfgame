function createHud() {
    const strikePowerBar = document.getElementById("strike-meter-value");
    const strokesNumberText = document.getElementById("strokes-number-text");
    const strokesLabelText = document.getElementById("strokes-label-text");
    const holeNumberText = document.getElementById("hole-full-text");
    const parNumberText = document.getElementById("par-full-text");

    const hud = {};

    const setStrikePowerBarValue = (value) => {
        strikePowerBar.style.height = value.toFixed(0) + "%";
    };

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

    hud.tick = () => {
        const strikePower = hud.pullStrikePowerPercent() * 100;
        setStrikePowerBarValue(strikePower);
    };

    return hud;
}

export { createHud };
