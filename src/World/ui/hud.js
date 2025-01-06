function createHud() {
    const strikePowerBar = document.getElementById("strike-meter-value");
    const strokesValueText = document.getElementById("strokes-value-text");
    const parText = document.getElementById("par-value-text");
    
    const hud = {};

    const setStrikePowerBarValue = (value) => {
        strikePowerBar.style.height = value.toFixed(0) + "%";
    };

    hud.setStrokesText = (value) => {
       strokesValueText.textContent = value.toFixed(0); 
    };

    hud.setParText = (value) => {
        parText.textContent = value.toFixed(0);
    };

    hud.pullStrikePowerPercent = () => {};

    hud.tick = () => {
        const strikePower = hud.pullStrikePowerPercent() * 100;
        setStrikePowerBarValue(strikePower);
    };

    return hud;
}

export { createHud };
