/**
 * Handles touch buttons, fullscreen mode and rotate dialog.
 */
class TouchControl {
    isConnected = false;

    constructor(keyboard, resetKeys) {
        this.keyboard = keyboard;
        this.resetKeys = resetKeys;
    }

    init() {
        this.updateTouchClass();
        this.connectButtons();
        this.connectScreenEvents();
        this.updateRotateDialog();
    }

    getElement(id) {
        return document.getElementById(id);
    }

    updateTouchClass() {
        document.body.classList.toggle("touch-device", this.hasTouchInput());
    }

    hasTouchInput() {
        return "ontouchstart" in window ||
            navigator.maxTouchPoints > 0 ||
            window.matchMedia("(pointer: coarse)").matches;
    }

    connectButtons() {
        if (this.isConnected) return;

        this.connectButton("walkLeftButton", "LEFT");
        this.connectButton("walkRightButton", "RIGHT");
        this.connectButton("playerJumpButton", "SPACE");
        this.connectButton("bottleThrowButton", "D");

        this.isConnected = true;
    }

    connectButton(buttonId, keyName) {
        const button = this.getElement(buttonId);
        if (!button) return;

        button.addEventListener("touchstart", event => this.pressOnly(event, keyName), { passive: false });
        button.addEventListener("touchend", event => this.releaseOnly(event, keyName), { passive: false });
        button.addEventListener("touchcancel", event => this.releaseOnly(event, keyName), { passive: false });

        button.addEventListener("mousedown", event => this.pressOnly(event, keyName));
        button.addEventListener("mouseup", event => this.releaseOnly(event, keyName));
        button.addEventListener("mouseleave", event => this.releaseOnly(event, keyName));

        button.addEventListener("contextmenu", event => event.preventDefault());
    }

    pressOnly(event, keyName) {
        event.preventDefault();
        event.stopPropagation();

        this.releaseMovementKeysIfNeeded(keyName);
        this.keyboard[keyName] = true;
    }

    releaseOnly(event, keyName) {
        event.preventDefault();
        event.stopPropagation();

        this.keyboard[keyName] = false;
    }

    releaseMovementKeysIfNeeded(keyName) {
        if (keyName === "LEFT") {
            this.keyboard.RIGHT = false;
            this.keyboard.SPACE = false;
            return;
        }

        if (keyName === "RIGHT") {
            this.keyboard.LEFT = false;
            this.keyboard.SPACE = false;
            return;
        }

        if (keyName === "SPACE") {
            this.keyboard.LEFT = false;
            this.keyboard.RIGHT = false;
        }
    }

    connectScreenEvents() {
        window.addEventListener("blur", () => this.resetKeys());
        window.addEventListener("resize", () => this.updateRotateDialog());
        window.addEventListener("orientationchange", () => this.updateRotateDialog());
        document.addEventListener("fullscreenchange", () => this.updateFullscreenClass());
    }

    updateRotateDialog() {
        const dialog = this.getElement("rotateDeviceDialog");
        if (!dialog) return;

        const portrait = window.matchMedia("(orientation: portrait)").matches;
        const showDialog = this.hasTouchInput() && portrait;

        dialog.style.display = showDialog ? "flex" : "none";
        document.body.classList.toggle("rotate-device-active", showDialog);

        if (window.world && window.isGameRunning) {
            world.paused = showDialog;
            if (showDialog) this.resetKeys();
        }
    }

    toggleFullscreen() {
        const root = this.getElement("desertGameRoot");

        if (document.fullscreenElement) {
            document.exitFullscreen();
            return;
        }

        if (root && root.requestFullscreen) {
            root.requestFullscreen().catch(() => {});
        }
    }

    updateFullscreenClass() {
        const root = this.getElement("desertGameRoot");
        const fullscreenActive = !!document.fullscreenElement;

        if (root) root.classList.toggle("is-fullscreen", fullscreenActive);
        document.body.classList.toggle("is-fullscreen", fullscreenActive);
    }
}