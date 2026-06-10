/**
 * Handles the game audio with music and sound effects.
 */
class GameAudio {
    constructor() {
        this.muted = false;
        this.unlocked = false;
        this.musicTracks = {};
        this.effectSounds = {};

        this.loadAudioFiles();
    }

    /**
     * Registers all game audio files.
     * @returns {void}
     */
    loadAudioFiles() {
        this.musicTracks = {
            backgroundTheme: this.createAudio("./assets/audio/game-music.mp3", true, 0.06),
            victoryTheme: this.createAudio("./assets/audio/win.mp3", false, 0.10),
            defeatTheme: this.createAudio("./assets/audio/game-over.mp3", false, 0.10),
            emptyBottleTheme: this.createAudio("./assets/audio/no-bottles.mp3", false, 0.10)
        };

        this.effectSounds = {
            walkingLoop: this.createAudio("./assets/audio/run.mp3", true, 0.03),
            jumpSound: this.createAudio("./assets/audio/jump.mp3", false, 0.06),
            bottlePickup: this.createAudio("./assets/audio/bottle-collect.mp3", false, 0.05),
            coinPickup: this.createAudio("./assets/audio/coin-collect.mp3", false, 0.04),
            bottleCrash: this.createAudio("./assets/audio/bottle-break.mp3", false, 0.06),
            enemyDefeat: this.createAudio("./assets/audio/enemy-kill.mp3", false, 0.06),
            playerDamage: this.createAudio("./assets/audio/character-hit.mp3", false, 0.07),
            bossDamage: this.createAudio("./assets/audio/endboss-hit.mp3", false, 0.05)
        };
    }

    /**
     * Creates one audio element.
     * @param {string} src Audio path.
     * @param {boolean} loop True if audio should loop.
     * @param {number} volume Audio volume.
     * @returns {HTMLAudioElement}
     */
     prepareSoundFile(path, shouldRepeat, loudness) {
        const soundFile = new Audio();
    
        soundFile.src = path;
        soundFile.loop = shouldRepeat;
        soundFile.volume = loudness;
        soundFile.preload = "auto";
        return soundFile;
    }
}