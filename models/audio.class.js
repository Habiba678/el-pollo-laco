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
        this.loadMuteState();
    }

    loadAudioFiles() {
        this.musicTracks = {
            backgroundTheme: this.prepareSoundFile("./assets/audio/game-music.mp3", true, 0.06),
            victoryTheme: this.prepareSoundFile("./assets/audio/win.mp3", false, 0.10),
            defeatTheme: this.prepareSoundFile("./assets/audio/game-over.mp3", false, 0.10),
            emptyBottleTheme: this.prepareSoundFile("./assets/audio/no-bottles.mp3", false, 0.10)
        };

        this.effectSounds = {
            walkingLoop: this.prepareSoundFile("./assets/audio/run.mp3", true, 0.03),
            jumpSound: this.prepareSoundFile("./assets/audio/jump.mp3", false, 0.06),
            bottlePickup: this.prepareSoundFile("./assets/audio/bottle-collect.mp3", false, 0.05),
            coinPickup: this.prepareSoundFile("./assets/audio/coin-collect.mp3", false, 0.04),
            bottleCrash: this.prepareSoundFile("./assets/audio/bottle-break.mp3", false, 0.06),
            enemyDefeat: this.prepareSoundFile("./assets/audio/enemy-kill.mp3", false, 0.06),
            playerDamage: this.prepareSoundFile("./assets/audio/character-hit.mp3", false, 0.07),
            bossDamage: this.prepareSoundFile("./assets/audio/endboss-hit.mp3", false, 0.05)
        };
    }

    prepareSoundFile(path, shouldRepeat, loudness) {
        const soundFile = new Audio();

        soundFile.src = path;
        soundFile.loop = shouldRepeat;
        soundFile.volume = loudness;
        soundFile.preload = "auto";

        return soundFile;
    }

    loadMuteState() {
        const savedState = localStorage.getItem("audioMuted");

        if (savedState !== null) {
            this.muted = savedState === "true";
        }

        return this.muted;
    }

    saveMuteState() {
        localStorage.setItem("audioMuted", String(this.muted));
    }

    toggleMute() {
        this.muted = !this.muted;
        this.saveMuteState();

        return this.muted;
    }
}