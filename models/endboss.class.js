/**
 * Final boss.
 */
class Endboss extends MovableObject {
    x = 2200;
    y = 140;
    width = 180;
    height = 260;

    movingSpeed = 1.1;
    leapSpeed = 3.2;
    healthValue = 100;
    bottleDamage = 20;

    world = null;
    isInFightMode = false;
    isLeaping = false;
    otherDirection = false;

    offset = {
        top: 45,
        bottom: 5,
        left: 15,
        right: 15
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
     * Creates the boss.
     */
    constructor() {
        super();
        this.loadImage(this.watchFrames[0]);
        this.loadBossImages();
        this.groundLevel = 180;
        this.applyGravity();
        this.startVisualLoop();
    }

    /**
     * Loads boss images.
     * @returns {void}
     */
    loadBossImages() {
        const groups = [
            this.watchFrames,
            this.stepFrames,
            this.painFrames,
            this.fallFrames
        ];

        for (let i = 0; i < groups.length; i++) {
            this.loadImages(groups[i]);
        }
    }

    /**
     * Starts image loop.
     * @returns {void}
     */
    startVisualLoop() {
        setInterval(() => {
            this.updateBossImage();
        }, 180);
    }

    /**
     * Updates boss image.
     * @returns {void}
     */
    updateBossImage() {
        if (this.isDead()) {
            this.playAnimation(this.fallFrames);
            return;
        }

        if (this.isHurt()) {
            this.playAnimation(this.painFrames);
            return;
        }

        if (this.isInFightMode) {
            this.playAnimation(this.stepFrames);
            return;
        }

        this.playAnimation(this.watchFrames);
    }

    /**
     * Moves toward player.
     * @param {number} playerX Player x position.
     * @returns {void}
     */
    approachPlayer(playerX) {
        if (this.isDead()) return;
        if (this.isLeaping) return;

        const stopX = playerX + 115;
        const nextPosition = this.x - this.movingSpeed;

        if (nextPosition > stopX) {
            this.x = nextPosition;
            this.otherDirection = false;
            return;
        }

        this.x = stopX;
        this.otherDirection = false;
    }

    /**
     * Starts jump attack.
     * @returns {void}
     */
    beginLeapAttack() {
        if (!this.canStartLeap()) return;

        this.isLeaping = true;
        this.speedY = 20;
        this.runLeapMovement();
    }

    /**
     * Checks leap state.
     * @returns {boolean}
     */
    canStartLeap() {
        if (!this.world) return false;
        if (this.isDead()) return false;
        if (this.isLeaping) return false;

        return true;
    }

    /**
     * Moves during leap.
     * @returns {void}
     */
    runLeapMovement() {
        const timer = setInterval(() => {
            if (this.shouldFinishLeap()) {
                clearInterval(timer);
                this.isLeaping = false;
                return;
            }

            this.x = this.x - this.leapSpeed;
            this.otherDirection = false;
        }, 1000 / 60);
    }

    /**
     * Checks leap finish.
     * @returns {boolean}
     */
    shouldFinishLeap() {
        const player = this.world ? this.world.character : null;
        const landed = !this.isAboveGround() && this.speedY === 0;

        if (this.isDead()) return true;
        if (!player) return true;
        if (this.isColliding(player)) return true;

        return landed;
    }

    /**
     * Reduces health.
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
     * Bottle hit alias.
     * @returns {void}
     */
    hit() {
        this.receiveBottleHit();
    }

    /**
     * Checks death.
     * @returns {boolean}
     */
    isDead() {
        return this.healthValue <= 0;
    }
}