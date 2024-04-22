function createDebugScreen() {
    const debugScreen = {
        visible: true,
        entries: [],
        textContent: "",
        textElement: document.getElementById("debug-text"),
    }

    debugScreen.tick = (delta) => {
        if(!debugScreen.visible) return;

        debugScreen.textContent = "";
        for(let entry of debugScreen.entries) {
            debugScreen.textContent += 
                entry.label + (entry.textFunc()) +"<BR>";
        }
        debugScreen.textElement.innerHTML = debugScreen.textContent;
    }

    debugScreen.addEntry = (label, textFunc) => {
        debugScreen.entries.push({
            label: label,
            textFunc: textFunc,
        });
    };

    debugScreen.toggleVisibility = () => {
        if(debugScreen.visible) {
            debugScreen.visible = false;
            debugScreen.textElement.style.visibility = "hidden";
        } else {
            debugScreen.visible = true;
            debugScreen.textElement.style.visibility = "visible";
        }
    };

    return debugScreen;

}

export { createDebugScreen };
