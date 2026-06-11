/**
 * Handles touch buttons, fullscreen mode and rotate dialog.
 */
class TouchControl {
    isConnected = false;

    /**
     * Creates the touch control helper.
     * @param {Keyboard} keyboard Shared keyboard object.
     * @param {Function} resetKeys Function to reset inputs.
     */
    constructor(keyboard, resetKeys) {
        this.keyboard = keyboard;
        this.resetKeys = resetKeys;
    }

    /**
     * Starts all responsive helpers.
     * @returns {void}
     */
    init() {
        this.updateTouchClass();
        this.connectButtons();
        this.connectScreenEvents();
        this.updateRotateDialog();
    }

    /**
     * Gets one element by id.
     * @param {string} id Element id.
     * @returns {HTMLElement|null} Found element.
     */
    getElement(id) {
        return document.getElementById(id);
    }

    /**
     * Updates touch-device body class.
     * @returns {void}
     */
    updateTouchClass() {
        document.body.classList.toggle("touch-device", this.hasTouchInput());
    }

    /**
     * Checks touch input support.
     * @returns {boolean} True if touch input exists.
     */
    hasTouchInput() {
        return "ontouchstart" in window ||
            navigator.maxTouchPoints > 0 ||
            window.matchMedia("(pointer: coarse)").matches;
    }

    /**
     * Connects all touch buttons once.
     * @returns {void}
     */
    connectButtons() {
        if (this.isConnected) return;

        this.connectButton("walkLeftButton", "LEFT");
        this.connectButton("walkRightButton", "RIGHT");
        this.connectButton("playerJumpButton", "SPACE");
        this.connectButton("bottleThrowButton", "D");
        this.isConnected = true;
    }

    /**
     * Connects one button with one key.
     * @param {string} buttonId Button id.
     * @param {string} keyName Keyboard key name.
     * @returns {void}
     */
    connectButton(buttonId, keyName) {
        const button = this.getElement(buttonId);
        if (!button) return;

        this.connectTouchEvents(button, keyName);
        this.connectMouseEvents(button, keyName);
        button.addEventListener("contextmenu", event => event.preventDefault());
    }

    /**
     * Connects touch events.
     * @param {HTMLElement} button Button element.
     * @param {string} keyName Keyboard key name.
     * @returns {void}
     */
    connectTouchEvents(button, keyName) {
        button.addEventListener("touchstart", event => this.pressOnly(event, keyName), { passive: false });
        button.addEventListener("touchend", event => this.releaseOnly(event, keyName), { passive: false });
        button.addEventListener("touchcancel", event => this.releaseOnly(event, keyName), { passive: false });
    }

    /**
     * Connects mouse events.
     * @param {HTMLElement} button Button element.
     * @param {string} keyName Keyboard key name.
     * @returns {void}
     */
    connectMouseEvents(button, keyName) {
        button.addEventListener("mousedown", event => this.pressOnly(event, keyName));
        button.addEventListener("mouseup", event => this.releaseOnly(event, keyName));
        button.addEventListener("mouseleave", event => this.releaseOnly(event, keyName));
    }

    /**
     * Presses one virtual key.
     * @param {Event} event Input event.
     * @param {string} keyName Keyboard key name.
     * @returns {void}
     */
    pressOnly(event, keyName) {
        this.stopInputEvent(event);
        this.releaseMovementKeysIfNeeded(keyName);
        this.keyboard[keyName] = true;
    }

    /**
     * Releases one virtual key.
     * @param {Event} event Input event.
     * @param {string} keyName Keyboard key name.
     * @returns {void}
     */
    releaseOnly(event, keyName) {
        this.stopInputEvent(event);
        this.keyboard[keyName] = false;
    }

    /**
     * Stops an input event safely.
     * @param {Event} event Input event.
     * @returns {void}
     */
    stopInputEvent(event) {
        if (event.cancelable) event.preventDefault();

        event.stopPropagation();
    }

    /**
     * Prevents mixed movement keys.
     * @param {string} keyName Keyboard key name.
     * @returns {void}
     */
    releaseMovementKeysIfNeeded(keyName) {
        if (keyName === "LEFT") return this.releaseForLeft();
        if (keyName === "RIGHT") return this.releaseForRight();
        if (keyName === "SPACE") this.releaseForJump();
    }

    /**
     * Releases keys before left movement.
     * @returns {void}
     */
    releaseForLeft() {
        this.keyboard.RIGHT = false;
        this.keyboard.SPACE = false;
    }

    /**
     * Releases keys before right movement.
     * @returns {void}
     */
    releaseForRight() {
        this.keyboard.LEFT = false;
        this.keyboard.SPACE = false;
    }

    /**
     * Releases keys before jump.
     * @returns {void}
     */
    releaseForJump() {
        this.keyboard.LEFT = false;
        this.keyboard.RIGHT = false;
    }

    /**
     * Connects screen related events.
     * @returns {void}
     */
    connectScreenEvents() {
        window.addEventListener("blur", () => this.resetKeys());
        window.addEventListener("resize", () => this.updateRotateDialog());
        window.addEventListener("orientationchange", () => this.updateRotateDialog());
        document.addEventListener("fullscreenchange", () => this.updateFullscreenClass());
    }

    /**
     * Updates the rotate-device dialog.
     * @returns {void}
     */
    updateRotateDialog() {
        const dialog = this.getElement("rotateDeviceDialog");
        if (!dialog) return;

        const portrait = window.matchMedia("(orientation: portrait)").matches;
        const showDialog = this.hasTouchInput() && portrait;

        dialog.style.display = showDialog ? "flex" : "none";
        document.body.classList.toggle("rotate-device-active", showDialog);
        this.updateWorldPause(showDialog);
    }

    /**
     * Updates world pause state.
     * @param {boolean} shouldPause True if world should pause.
     * @returns {void}
     */
    updateWorldPause(shouldPause) {
        if (!window.world || !window.isGameRunning) return;

        world.paused = shouldPause;
        if (shouldPause) this.resetKeys();
    }

    /**
     * Toggles fullscreen mode.
     * @returns {void}
     */
    toggleFullscreen() {
        const root = this.getElement("desertGameRoot");

        if (document.fullscreenElement) {
            document.exitFullscreen();
            return;
        }

        root?.requestFullscreen?.().catch(() => {});
    }

    /**
     * Updates fullscreen classes.
     * @returns {void}
     */
    updateFullscreenClass() {
        const root = this.getElement("desertGameRoot");
        const fullscreenActive = !!document.fullscreenElement;

        root?.classList.toggle("is-fullscreen", fullscreenActive);
        document.body.classList.toggle("is-fullscreen", fullscreenActive);
    }
}