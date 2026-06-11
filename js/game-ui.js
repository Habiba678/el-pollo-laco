/**
 * Manages dialogs, templates, buttons and IU updates.
 */

let gameToolbar;
let startGameButton;
let playAgainButton;
let restartToolbarButton;

/**
 * Mounts all UI templates into the current HTML containers.
 * @returns {void}
 */
function mountTemplates() {
    placeTemplate("gameHeaderMount", getTopBarTemplate);
    placeTemplate("gameIntroMount", getStartButtonTemplate);
    placeTemplate("gameFooterMount", getBottomButtonsTemplate);
}

/**
 * Inserts one template into one target element.
 * @param {string} targetId Target element id.
 * @param {Function} templateBuilder Function that returns HTML.
 * @returns {void}
 */
function placeTemplate(targetId, templateBuilder) {
    const target = document.getElementById(targetId);

    if (!target || typeof templateBuilder !== "function") return;

    target.innerHTML = templateBuilder();
}

/**
 * Stores frequently used UI elements.
 * @returns {void}
 */
function cacheUiElements() {
    gameToolbar = document.getElementById("gameToolbar");
    startGameButton = document.getElementById("startGameButton");
    playAgainButton = document.getElementById("playAgainButton");
    restartToolbarButton = document.getElementById("restartToolbarButton");
}

/**
 * Updates the body mode classes.
 * @returns {void}
 */
function updateViewMode() {
    document.body.classList.remove("start-screen-mode", "game-running-mode", "game-over-mode");

    if (isGameFinished) {
        document.body.classList.add("game-over-mode");
        return;
    }

    if (isGameRunning) {
        document.body.classList.add("game-running-mode");
        return;
    }

    document.body.classList.add("start-screen-mode");
}

/**
 * Refreshes all visible UI parts based on the game state.
 * @returns {void}
 */
function refreshGameUi() {
    updateViewMode();

    const showStartControls = !isGameRunning && !isGameFinished;
    const showRestartControls = isGameFinished;

    setElementDisplay("launchPanel", showStartControls || showRestartControls, "ui-flex");
    setElementDisplay("footerActionRow", showStartControls, "ui-flex");
    setElementDisplay("startGameButton", showStartControls, "ui-flex");
    setElementDisplay("playAgainButton", showRestartControls, "ui-flex");
    setElementDisplay("restartToolbarButton", isGameRunning, "ui-flex");
}

/**
 * Shows or hides one element by class.
 * @param {string} elementId Element id.
 * @param {boolean} visible True if visible.
 * @param {string} displayClass Visible display class.
 * @returns {void}
 */
function setElementDisplay(elementId, visible, displayClass = "ui-block") {
    const element = document.getElementById(elementId);

    if (!element) return;

    element.classList.remove("ui-hidden", "ui-flex", "ui-block");
    element.classList.add(visible ? displayClass : "ui-hidden");
}

/**
 * Shows the start UI.
 * @returns {void}
 */
function showStartView() {
    isGameRunning = false;
    isGameFinished = false;
    refreshGameUi();
}

/**
 * Shows the running-game UI.
 * @returns {void}
 */
function showGameView() {
    isGameRunning = true;
    isGameFinished = false;
    refreshGameUi();
}

/**
 * Shows the finished-game UI.
 * @returns {void}
 */
function showFinishedView() {
    isGameRunning = false;
    isGameFinished = true;
    refreshGameUi();
}

/**
 * Opens a dialog and pauses the world if needed.
 * @param {string} dialogId Dialog id.
 * @returns {void}
 */
function openDialog(dialogId) {
    const dialog = document.getElementById(dialogId);

    if (!dialog) return;

    dialog.classList.remove("dialog-closed");
    document.body.classList.add("dialog-open");
    pauseWorldForDialog();
}

/**
 * Opens a dialog from a compact menu button.
 * @param {string} dialogId Dialog id.
 * @returns {void}
 */
function openDialogFromMenu(dialogId) {
    openDialog(dialogId);
}

/**
 * Closes one dialog and resumes the world if possible.
 * @param {string} dialogId Dialog id.
 * @returns {void}
 */
function closeDialog(dialogId) {
    const dialog = document.getElementById(dialogId);

    if (dialog) dialog.classList.add("dialog-closed");

    updateOverlayState();
    resumeWorldAfterDialog();
}

/**
 * Closes all open dialogs.
 * @returns {void}
 */
function closeAllDialogs() {
    ["imprintDialog", "instructionDialog"].forEach((dialogId) => {
        const dialog = document.getElementById(dialogId);
        if (dialog) dialog.classList.add("dialog-closed");
    });

    updateOverlayState();
    resumeWorldAfterDialog();
}

/**
 * Handles Escape key for dialogs.
 * @param {KeyboardEvent} event Keyboard event.
 * @returns {void}
 */
function handleDialogEscape(event) {
    if (event.key === "Escape") closeAllDialogs();
}

/**
 * Checks if at least one dialog is open.
 * @returns {boolean} True if a dialog is open.
 */
function hasOpenDialog() {
    return ["imprintDialog", "instructionDialog"].some((dialogId) => {
        const dialog = document.getElementById(dialogId);
        return dialog && !dialog.classList.contains("dialog-closed");
    });
}

/**
 * Updates body overlay class.
 * @returns {void}
 */
function updateOverlayState() {
    document.body.classList.toggle("dialog-open", hasOpenDialog());
}

/**
 * Pauses the world while a dialog is open.
 * @returns {void}
 */
function pauseWorldForDialog() {
    if (!world || !isGameRunning) return;

    world.paused = true;

    if (typeof resetKeyboardState === "function") {
        resetKeyboardState();
    }
}

/**
 * Resumes the world after dialogs are closed.
 * @returns {void}
 */
function resumeWorldAfterDialog() {
    if (!world || !isGameRunning || hasOpenDialog()) return;

    world.paused = false;
}

/**
 * Updates the mute slash visibility.
 * @param {string} lineId Element id.
 * @param {boolean} muted True if muted.
 * @returns {void}
 */
function updateSoundLine(lineId, muted) {
    const line = document.getElementById(lineId);

    if (line) line.classList.toggle("sound-line-hidden", !muted);
}

/**
 * Updates all sound icons.
 * @param {boolean} muted True if muted.
 * @returns {void}
 */
function updateSoundUi(muted) {
    updateSoundLine("soundLineDesktop", muted);
    updateSoundLine("soundLineCompact", muted);
}