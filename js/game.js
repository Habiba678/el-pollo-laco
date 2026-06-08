let canvas;
let world;
let keyboard = new Keyboard();

let isGameRunning = false;
let audioMuted = false;

const mobileControls = {
    toggleFullscreen() {
        const root = document.getElementById("desertGameRoot");

        if (!document.fullscreenElement && root?.requestFullscreen) {
            root.requestFullscreen();
        } else if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
};

/**
 * Initializes the game.
 */
function init() {
    mountTemplates();
    cacheUiElements();
    bindGameButtons();
    bindKeyboardEvents();
    showStartView();

    startGame(); // nur zum Test
}

/**
 * Connects buttons with game actions.
 */
function bindGameButtons() {
    if (startGameButton) {
        startGameButton.addEventListener("click", startGame);
    }

    if (playAgainButton) {
        playAgainButton.addEventListener("click", restartRoundDirectly);
    }
}

/**
 * Starts the game world.
 */
function startGame() {
    canvas = document.getElementById("canvas");

    if (!canvas) {
        console.error("Canvas element was not found.");
        return;
    }

    resetKeyboardState();
    isGameRunning = true;
    showGameView();

    world = new World(canvas, keyboard);

    console.log("World created:", world);
    console.log("Character:", world.character);
    console.log("Enemies:", world.level.enemies);
}

/**
 * Restarts the current round.
 */
function restartRoundDirectly() {
    returnToStartScreen();
    startGame();
}

/**
 * Returns to the start screen.
 */
function returnToStartScreen() {
    if (world) {
        world.gameOver = true;
        world = null;
    }

    isGameRunning = false;
    resetKeyboardState();
    clearCanvas();
    showStartView();
}

/**
 * Clears the canvas.
 */
function clearCanvas() {
    if (!canvas) canvas = document.getElementById("canvas");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

/**
 * Toggles the audio state.
 */
function switchAudioMode() {
    audioMuted = !audioMuted;
    toggleSoundLine("soundLineDesktop");
    toggleSoundLine("soundLineCompact");
}

/**
 * Shows or hides one sound line.
 * @param {string} id Element id.
 */
function toggleSoundLine(id) {
    const line = document.getElementById(id);
    if (line) line.classList.toggle("sound-line-hidden", !audioMuted);
}

/**
 * Binds keyboard events.
 */
function bindKeyboardEvents() {
    window.addEventListener("keydown", (event) => updateKeyboard(event, true));
    window.addEventListener("keyup", (event) => updateKeyboard(event, false));
}

/**
 * Updates keyboard state.
 * @param {KeyboardEvent} event Keyboard event.
 * @param {boolean} pressed True if pressed.
 */
function updateKeyboard(event, pressed) {
    if (event.keyCode === 39) keyboard.RIGHT = pressed;
    if (event.keyCode === 37) keyboard.LEFT = pressed;
    if (event.keyCode === 38) keyboard.UP = pressed;
    if (event.keyCode === 40) keyboard.DOWN = pressed;
    if (event.keyCode === 32) keyboard.SPACE = pressed;
    if (event.keyCode === 68) keyboard.D = pressed;
}

/**
 * Resets all keyboard states.
 */
function resetKeyboardState() {
    keyboard.RIGHT = false;
    keyboard.LEFT = false;
    keyboard.UP = false;
    keyboard.DOWN = false;
    keyboard.SPACE = false;
    keyboard.D = false;
}