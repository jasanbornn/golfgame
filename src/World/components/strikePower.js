function createStrikePower(minStrikePower, maxStrikePower) {
    const intervals = 64;

    const minPower = minStrikePower;
    const maxPower = maxStrikePower;
    const powerInterval = (maxPower - minPower) / intervals;
    const startPower = (maxPower + minPower) / 4;

    const strikePower = {
        power: startPower,
    };

    strikePower.getValue = () => {
        return strikePower.power;
    };

    strikePower.percentPower = () => {
        return strikePower.power / maxPower;
    };

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

