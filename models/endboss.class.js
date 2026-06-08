/**
 * Controls the final chicken boss logic.
 */
class Endboss extends MovableObject {
    x = 2500;
    y = 55;
    width = 250;
    height = 400;

    movingSpeed = 1.08;
    leapSpeed = 3.05;
    healthValue = 100;
    bottleDamage = 20;

    world = null;
    isInFightMode = false;
    isLeaping = false;

    offset = {
        top: 85,
        bottom: 25,
        left: 38,
        right: 42
    };

    watchFrames = [
        "./assets/img/4_enemie_boss_chicken/2_alert/G5.png",
        "./assets/img/4_enemie_boss_chicken/2_alert/G6.png",
        "./assets/img/4_enemie_boss_chicken/2_alert/G7.png",
        "./assets/img/4_enemie_boss_chicken/2_alert/G8.png",
        "./assets/img/4_enemie_boss_chicken/2_alert/G9.png",
        "./assets/img/4_enemie_boss_chicken/2_alert/G10.png",
        "./assets/img/4_enemie_boss_chicken/2_alert/G11.png",
        "./assets/img/4_enemie_boss_chicken/2_alert/G12.png"
    ];

    stepFrames = [
        "./assets/img/4_enemie_boss_chicken/1_walk/G1.png",
        "./assets/img/4_enemie_boss_chicken/1_walk/G2.png",
        "./assets/img/4_enemie_boss_chicken/1_walk/G3.png",
        "./assets/img/4_enemie_boss_chicken/1_walk/G4.png"
    ];

    painFrames = [
        "./assets/img/4_enemie_boss_chicken/4_hurt/G21.png",
        "./assets/img/4_enemie_boss_chicken/4_hurt/G22.png",
        "./assets/img/4_enemie_boss_chicken/4_hurt/G23.png"
    ];

    fallFrames = [
        "./assets/img/4_enemie_boss_chicken/5_dead/G24.png",
        "./assets/img/4_enemie_boss_chicken/5_dead/G25.png",
        "./assets/img/4_enemie_boss_chicken/5_dead/G26.png"
    ];

    /**
     * Creates the boss and starts its image loop.
     */
    constructor() {
        super();
        this.loadImage(this.watchFrames[0]);
        this.prepareBossSprites();
        this.groundLevel = this.y;
        this.applyGravity();
        this.startImageUpdates();
    }

    /**
     * Loads all boss image groups.
     * @returns {void}
     */
    prepareBossSprites() {
        const spriteGroups = [
            this.watchFrames,
            this.stepFrames,
            this.painFrames,
            this.fallFrames
        ];

        for (let index = 0; index < spriteGroups.length; index++) {
            this.loadImages(spriteGroups[index]);
        }
    }

    /**
     * Starts repeated visual updates.
     * @returns {void}
     */
    startImageUpdates() {
        setInterval(() => {
            this.showCurrentState();
        }, 185);
    }

    /**
     * Selects the visible boss animation.
     * @returns {void}
     */
    showCurrentState() {
        let selectedFrames = this.watchFrames;

        if (this.healthValue < 1) {
            selectedFrames = this.fallFrames;
        } else if (this.isHurt()) {
            selectedFrames = this.painFrames;
        } else if (this.isInFightMode) {
            selectedFrames = this.stepFrames;
        }

        this.playAnimation(selectedFrames);
    }

    /**
     * Moves closer to the player without touching too early.
     * @param {number} playerX Player x position.
     * @returns {void}
     */
    approachPlayer(playerX) {
        if (this.healthValue < 1) return;
        if (this.isLeaping) return;

        const border = playerX + 130;
        const nextX = this.x - this.movingSpeed;

        if (nextX > border) {
            this.x = nextX;
            return;
        }

        if (this.x > border) {
            this.x = border;
        }
    }

    /**
     * Starts a leap attack.
     * @returns {void}
     */
    beginLeapAttack() {
        if (this.canLeap()) {
            this.isLeaping = true;
            this.speedY = 20;
            this.continueLeapAttack();
        }
    }

    /**
     * Checks if the leap attack can start.
     * @returns {boolean} True if the leap may start.
     */
    canLeap() {
        if (!this.world) return false;
        if (this.isLeaping) return false;
        if (this.healthValue < 1) return false;

        return true;
    }

    /**
     * Moves the boss during the leap attack.
     * @returns {void}
     */
    continueLeapAttack() {
        const leapTimer = setInterval(() => {
            const shouldEnd = this.shouldStopLeap();

            if (shouldEnd) {
                this.isLeaping = false;
                clearInterval(leapTimer);
            } else {
                this.x = this.x - this.leapSpeed;
            }
        }, 1000 / 60);
    }

    /**
     * Checks if the leap attack is finished.
     * @returns {boolean} True if the leap should stop.
     */
    shouldStopLeap() {
        const player = this.world ? this.world.character : null;

        if (this.healthValue < 1) return true;
        if (!player) return true;
        if (this.isColliding(player)) return true;

        return !this.isAboveGround() && this.speedY === 0;
    }

    /**
     * Applies damage to the boss.
     * @returns {void}
     */
    receiveBottleHit() {
        this.healthValue = this.healthValue - this.bottleDamage;

        if (this.healthValue < 0) {
            this.healthValue = 0;
        }

        if (this.healthValue > 0) {
            this.lastHit = Date.now();
        }
    }

    /**
     * Compatibility method for bottle-hit logic.
     * @returns {void}
     */
    hit() {
        this.receiveBottleHit();
    }

    /**
     * Compatibility method for defeat checks.
     * @returns {boolean} True if the boss has no health left.
     */
    isDead() {
        if (this.healthValue > 0) {
            return false;
        }

        return true;
    }
}