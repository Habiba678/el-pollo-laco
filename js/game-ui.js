let gameToolbar;
let startGameButton;
let playAgainButton;

/**
 * Mounts the template parts into the page.
 */
function mountTemplates() {
    setTemplate("gameHeaderMount", getTopBarTemplate);
    setTemplate("gameIntroMount", getStartButtonTemplate);
    setTemplate("gameFooterMount", getBottomButtonsTemplate);
}

/**
 * Inserts one template into one element.
 * @param {string} id Target element id.
 * @param {Function} templateFn Template function.
 */
function setTemplate(id, templateFn) {
    const element = document.getElementById(id);
    if (element) element.innerHTML = templateFn();
}

/**
 * Saves important UI elements.
 */
function cacheUiElements() {
    gameToolbar = document.getElementById("gameToolbar");
    startGameButton = document.getElementById("startGameButton");
    playAgainButton = document.getElementById("playAgainButton");
}

/**
 * Shows the start view.
 */
function showStartView() {
    document.body.classList.add("start-screen-mode");
    document.body.classList.remove("game-running-mode", "game-over-mode");

    toggleElement("launchPanel", true, "flex");
    toggleElement("footerActionRow", true, "flex");

    if (startGameButton) startGameButton.style.display = "flex";
    if (playAgainButton) playAgainButton.style.display = "none";
}

/**
 * Shows the running game view.
 */
function showGameView() {
    document.body.classList.remove("start-screen-mode", "game-over-mode");
    document.body.classList.add("game-running-mode");

    toggleElement("launchPanel", false);
    toggleElement("footerActionRow", false);
}

/**
 * Shows or hides an element.
 * @param {string} id Element id.
 * @param {boolean} visible Visibility state.
 * @param {string} displayValue Display value.
 */
function toggleElement(id, visible, displayValue = "block") {
    const element = document.getElementById(id);
    if (element) element.style.display = visible ? displayValue : "none";
}

/**
 * Opens one dialog.
 * @param {string} id Dialog id.
 */
function openDialog(id) {
    const dialog = document.getElementById(id);
    if (!dialog) return;

    dialog.classList.remove("dialog-hidden");
    document.body.classList.add("overlay-open");
}

/**
 * Opens one dialog from the menu.
 * @param {string} id Dialog id.
 */
function openDialogFromMenu(id) {
    openDialog(id);
}

/**
 * Closes one dialog.
 * @param {string} id Dialog id.
 */
function closeDialog(id) {
    const dialog = document.getElementById(id);
    if (dialog) dialog.classList.add("dialog-hidden");

    document.body.classList.remove("overlay-open");
}