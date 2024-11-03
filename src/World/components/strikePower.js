function createStrikePower() {
    const intervals = 64;

    const minStrikePower = 1;
    const maxStrikePower = 60;
    const powerInterval = (maxStrikePower - minStrikePower) / intervals;
    const startPower = (maxStrikePower + minStrikePower) / 4;

    const strikePower = {
        power: startPower,
    };

    strikePower.getValue = () => {
        return strikePower.power;
    };

    strikePower.percentPower = () => {
        return strikePower.power / maxStrikePower;
    };

    strikePower.setPercentPower = (percent) => {
        strikePower.power = maxStrikePower * percent;
    }

    strikePower.increasePower = () => {
        strikePower.power += powerInterval;
        if (strikePower.power > maxStrikePower) {
            strikePower.power = maxStrikePower;
        }
    };

    strikePower.decreasePower = () => {
        strikePower.power -= powerInterval;
        if (strikePower.power < minStrikePower) {
            strikePower.power = minStrikePower;
        }
    };

    return strikePower;
}

export { createStrikePower };

