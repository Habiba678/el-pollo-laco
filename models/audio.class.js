/**
 * Handles music and sound effects for the game.
 */
class GameAudio {
    /**
     * Creates the audio controller and prepares all sound files.
     */
    constructor() {
        this.storageKey = "polloAudioOff";
        this.audioMuted = this.loadMuteSetting();
        this.soundLocked = false;
        this.unlocked = false;

        this.mainTheme = this.makeSound("./assets/audio/game-music.mp3", true, 0.06);
        this.winTheme = this.makeSound("./assets/audio/win.mp3", false, 0.10);
        this.loseTheme = this.makeSound("./assets/audio/game-over.mp3", false, 0.10);
        this.noBottleTheme = this.makeSound("./assets/audio/no-bottles.mp3", false, 0.10);

        this.walkSound = this.makeSound("./assets/audio/run.mp3", true, 0.03);
        this.jumpSound = this.makeSound("./assets/audio/jump.mp3", false, 0.06);
        this.bottlePickSound = this.makeSound("./assets/audio/bottle-collect.mp3", false, 0.05);
        this.coinPickSound = this.makeSound("./assets/audio/coin-collect.mp3", false, 0.04);
        this.bottleBreakSound = this.makeSound("./assets/audio/bottle-break.mp3", false, 0.06);
        this.enemyKillSound = this.makeSound("./assets/audio/enemy-kill.mp3", false, 0.06);
        this.characterHitSound = this.makeSound("./assets/audio/character-hit.mp3", false, 0.07);
        this.endbossHitSound = this.makeSound("./assets/audio/endboss-hit.mp3", false, 0.05);

        this.shortSounds = new Set();
        this.unlockAfterUserAction();
    }

    /**
     * Builds one audio element.
     * @param {string} path Audio file path.
     * @param {boolean} loop True if the sound should loop.
     * @param {number} volume Sound volume.
     * @returns {HTMLAudioElement} Prepared audio element.
     */
    makeSound(path, loop, volume) {
        const audio = new Audio();

        audio.src = path;
        audio.loop = loop;
        audio.volume = volume;
        audio.preload = "auto";

        return audio;
    }

    /**
     * Unlocks browser audio after the first user action.
     * @returns {void}
     */
    unlockAfterUserAction() {
        const unlock = () => {
            this.unlocked = true;
            window.removeEventListener("click", unlock);
            window.removeEventListener("touchend", unlock);
            window.removeEventListener("keyup", unlock);
        };

        window.addEventListener("click", unlock);
        window.addEventListener("touchend", unlock);
        window.addEventListener("keyup", unlock);
    }

    /**
     * Loads mute setting from local storage.
     * @returns {boolean} True if audio is muted.
     */
    loadMuteSetting() {
        return localStorage.getItem(this.storageKey) === "true";
    }

    /**
     * Saves mute setting into local storage.
     * @returns {void}
     */
    saveMuteSetting() {
        localStorage.setItem(this.storageKey, String(this.audioMuted));
    }

    /**
     * Toggles mute state.
     * @returns {boolean} Current mute state.
     */
    toggleMute() {
        this.audioMuted = !this.audioMuted;
        this.saveMuteSetting();

        if (this.audioMuted) {
            this.stopAllAudio();
        }

        return this.audioMuted;
    }

    /**
     * Starts the background music.
     * @returns {void}
     */
    playMainTheme() {
        this.soundLocked = false;
        this.playLongSound(this.mainTheme, false);
    }

    /**
     * Plays the win sound.
     * @returns {void}
     */
    playWinTheme() {
        this.stopAllAudio();
        this.soundLocked = false;
        this.playLongSound(this.winTheme, true);
    }

    /**
     * Plays the game over sound.
     * @returns {void}
     */
    playLoseTheme() {
        this.stopAllAudio();
        this.soundLocked = false;
        this.playLongSound(this.loseTheme, true);
    }

    /**
     * Plays the no-bottle sound.
     * @returns {void}
     */
    playNoBottleTheme() {
        this.stopAllAudio();
        this.soundLocked = false;
        this.playLongSound(this.noBottleTheme, true);
    }

    /**
     * Plays one game effect by name.
     * @param {string} name Effect name.
     * @returns {void}
     */
    playEffect(name) {
        if (name === "run") this.playLongSound(this.walkSound, false);
        if (name === "jump") this.playShortSound(this.jumpSound);
        if (name === "bottleCollect") this.playShortSound(this.bottlePickSound);
        if (name === "coinCollect") this.playShortSound(this.coinPickSound);
        if (name === "bottleBreak") this.playShortSound(this.bottleBreakSound);
        if (name === "enemyKill") this.playShortSound(this.enemyKillSound);
        if (name === "characterHit") this.playShortSound(this.characterHitSound);
        if (name === "endbossHit") this.playShortSound(this.endbossHitSound);
    }

    /**
     * Stops one game effect by name.
     * @param {string} name Effect name.
     * @returns {void}
     */
    stopEffect(name) {
        if (name === "run") {
            this.stopOneSound(this.walkSound, true);
        }
    }

    /**
     * Plays a loop or music sound.
     * @param {HTMLAudioElement} sound Audio element.
     * @param {boolean} restart True if sound should restart.
     * @returns {void}
     */
    playLongSound(sound, restart) {
        if (!this.canPlay(sound)) return;
        if (!sound.paused && !restart) return;

        if (restart) {
            sound.currentTime = 0;
        }

        sound.play().catch(() => {});
    }

    /**
     * Plays a short sound effect as a separate copy.
     * @param {HTMLAudioElement} sound Audio element.
     * @returns {void}
     */
    playShortSound(sound) {
        if (!this.canPlay(sound)) return;

        const copy = sound.cloneNode(true);
        copy.loop = false;
        copy.volume = sound.volume;
        copy.currentTime = 0;

        this.shortSounds.add(copy);

        copy.onended = () => {
            this.shortSounds.delete(copy);
        };

        copy.play().catch(() => {
            this.shortSounds.delete(copy);
        });
    }

    /**
     * Checks if sound playback is allowed.
     * @param {HTMLAudioElement} sound Audio element.
     * @returns {boolean} True if sound can play.
     */
    canPlay(sound) {
        return !!sound && !this.audioMuted && this.unlocked && !this.soundLocked;
    }

    /**
     * Stops all music and effects.
     * @returns {void}
     */
    stopAllAudio() {
        this.soundLocked = true;

        this.stopOneSound(this.mainTheme, true);
        this.stopOneSound(this.winTheme, true);
        this.stopOneSound(this.loseTheme, true);
        this.stopOneSound(this.noBottleTheme, true);
        this.stopOneSound(this.walkSound, true);

        this.stopShortSounds();
    }

    /**
     * Stops one audio element.
     * @param {HTMLAudioElement} sound Audio element.
     * @param {boolean} reset True if playback time should reset.
     * @returns {void}
     */
    stopOneSound(sound, reset) {
        if (!sound) return;

        sound.pause();

        if (reset) {
            sound.currentTime = 0;
        }
    }

    /**
     * Stops all active short sound copies.
     * @returns {void}
     */
    stopShortSounds() {
        this.shortSounds.forEach(sound => {
            sound.pause();
            sound.currentTime = 0;
        });

        this.shortSounds.clear();
    }
}