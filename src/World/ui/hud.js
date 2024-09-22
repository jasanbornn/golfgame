function createHud() {
    const strikePowerValue = document.getElementById("strike-meter-value");
    
    const hud = {};

    const setStrikePowerValue = (value) => {
        strikePowerValue.style.width = value.toFixed(0) + "%";
    }

    hud.pullStrikePowerPercent = () => {};

    hud.tick = () => {
        const strikePower = hud.pullStrikePowerPercent() * 100;
        setStrikePowerValue(strikePower);
    };

    return hud;
}

export { createHud };
