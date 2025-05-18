function createStrikePower() {
    const intervals = 64;

    const minStrikePower = 1;
    const maxStrikePower = 90;
    const powerInterval = (maxStrikePower - minStrikePower) / intervals;

    const strikePower = {};

    strikePower.getValue = () => {
        return strikePower.power;
    };

    strikePower.percentPower = () => {
        return strikePower.power / maxStrikePower;
    };

    strikePower.setPercentPower = (percent) => {
        strikePower.power = maxStrikePower * percent;
    }

    strikePower.resetPower = () => {
        strikePower.power = (maxStrikePower + minStrikePower) / 4;
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

    strikePower.resetPower();

    return strikePower;
}

export { createStrikePower };

