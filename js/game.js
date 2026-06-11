let canvas;
let ctx;
let world;
let keyboard = new Keyboard();
let gameAudio = new GameAudio();

let canvasView;
let mobileControls;

let isGameRunning = false;
let isGameFinished = false;
let audioMuted = false;

const INPUT_MAP = new Map([
    [37, "LEFT"],
    [39, "RIGHT"],
    [38, "UP"],
    [40, "DOWN"],
    [32, "SPACE"],
    [68, "D"]
]);

const END_IMAGES = {
    success: "./assets/img/You won, you lost/You Win A.png",
    crash: "./assets/img/You won, you lost/Game Over.png",
    fail: "./assets/img/You won, you lost/You lost.png"
};

const LOST_SCREEN_DELAY = 1350;

/**
 * Starts all page setup steps.
 * @returns {void}
 */
function init() {
    insertPageTemplates();
    collectPageParts();
    createCanvasHelpers();
    createTouchHelpers();
    connectPageEvents();
    openStartScene();
    audioMuted = gameAudio.audioMuted;
    updateSoundUi(audioMuted);
}

/**
 * Inserts HTML templates into the page.
 * @returns {void}
 */
function insertPageTemplates() {
    mountTemplates();
}

/**
 * Caches UI and canvas elements.
 * @returns {void}
 */
function collectPageParts() {
    cacheUiElements();

    canvas = getElement("canvas");

    if (!canvas) {
        console.error("Game canvas could not be found.");
        return;
    }

    ctx = canvas.getContext("2d", { willReadFrequently: true });
}

/**
 * Gets one element by id.
 * @param {string} id Element id.
 * @returns {HTMLElement|null} The found element.
 */
function getElement(id) {
    return document.getElementById(id);
}

/**
 * Creates canvas screen helper.
 * @returns {void}
 */
function createCanvasHelpers() {
    if (!canvas) return;

    canvasView = new CanvasView(canvas);
}

/**
 * Creates touch input helper.
 * @returns {void}
 */
function createTouchHelpers() {
    mobileControls = new TouchControl(keyboard, clearInputs);
    mobileControls.init();
}

/**
 * Connects all UI and window events.
 * @returns {void}
 */
function connectPageEvents() {
    connectClick(startGameButton, beginRound);
    connectClick(playAgainButton, restartRoundDirectly);

    window.addEventListener("keydown", event => setInputByEvent(event, true));
    window.addEventListener("keyup", event => setInputByEvent(event, false));
    window.addEventListener("resize", refreshScreenHelpers);
    window.addEventListener("orientationchange", refreshScreenHelpers);
    window.addEventListener("keydown", handleDialogEscape);
}

/**
 * Adds click event to an element.
 * @param {HTMLElement|null} element Target element.
 * @param {Function} action Click action.
 * @returns {void}
 */
function connectClick(element, action) {
    if (element) element.addEventListener("click", action);
}

/**
 * Shows the start image and start buttons.
 * @returns {void}
 */
function openStartScene() {
    closeRunningWorld();
    clearInputs();

    isGameRunning = false;
    isGameFinished = false;

    refreshGameUi();

    if (gameAudio) gameAudio.stopAllAudio();
    if (canvasView) canvasView.showStart();
}

/**
 * Starts a new playable round.
 * @returns {void}
 */
function beginRound() {
    closeRunningWorld();
    clearInputs();

    isGameRunning = true;
    isGameFinished = false;

    refreshGameUi();

    world = new World(canvas, keyboard, gameAudio);
    gameAudio.playMainTheme();
}

/**
 * Restarts the current round.
 * @returns {void}
 */
function restartRoundDirectly() {
    beginRound();
}

/**
 * Returns from game view back to the start scene.
 * @returns {void}
 */
function returnToStartScreen() {
    openStartScene();
}

/**
 * Stops the active world.
 * @returns {void}
 */
function closeRunningWorld() {
    if (!world) return;

    world.gameOver = true;
    world = null;
}

/**
 * Updates keyboard state from a keyboard event.
 * @param {KeyboardEvent} event Keyboard event.
 * @param {boolean} active True if the key is active.
 * @returns {void}
 */
function setInputByEvent(event, active) {
    const inputName = INPUT_MAP.get(event.keyCode);

    if (inputName) keyboard[inputName] = active;
}

/**
 * Resets all stored input states.
 * @returns {void}
 */
function clearInputs() {
    INPUT_MAP.forEach(inputName => {
        keyboard[inputName] = false;
    });
}

/**
 * Refreshes mobile and fullscreen helpers.
 * @returns {void}
 */
function refreshScreenHelpers() {
    if (!mobileControls) return;

    mobileControls.updateTouchClass();
    mobileControls.updateRotateDialog();
}

/**
 * Toggles sound state and updates icon.
 * @returns {void}
 */
function switchAudioMode() {
    audioMuted = gameAudio.toggleMute();
    updateSoundUi(audioMuted);

    if (!audioMuted && isGameRunning) {
        gameAudio.playMainTheme();
    }
}

/**
 * Shows the success screen.
 * @returns {void}
 */
function showWinScreen() {
    if (gameAudio) gameAudio.playWinTheme();
    endRoundWithImage(END_IMAGES.success);
}

/**
 * Shows game over first and then lost image.
 * @returns {void}
 */
function showGameOverScreen() {
    if (gameAudio) gameAudio.playLoseTheme();
    endRoundWithImage(END_IMAGES.crash, END_IMAGES.fail);
}

/**
 * Shows the lost screen directly.
 * @returns {void}
 */
function showNoBottlesScreen() {
    if (gameAudio) gameAudio.playNoBottleTheme();
    endRoundWithImage(END_IMAGES.fail);
}

/**
 * Ends the game and draws result screens.
 * @param {string} mainImage First result image.
 * @param {string|null} followUpImage Optional second image.
 * @returns {void}
 */
function endRoundWithImage(mainImage, followUpImage = null) {
    isGameRunning = false;
    isGameFinished = true;
    clearInputs();

    if (world) world.gameOver = true;

    refreshGameUi();

    if (!canvasView) return;

    canvasView.showResult(mainImage);

    if (followUpImage) {
        setTimeout(() => {
            canvasView.showResult(followUpImage);
        }, LOST_SCREEN_DELAY);
    }
}