/**
 * Final boss.
 */
class Endboss extends MovableObject {
    x = 2200;
    y = 140;
    groundY = 140;
    width = 170;
    height = 310;

    movingSpeed = 1.1;
    leapSpeed = 3.5;
    healthValue = 100;
    bottleDamage = 20;

    world = null;
    isInFightMode = false;
    isLeaping = false;
    otherDirection = false;

    offset = {
        top: 60,
        bottom: 10,
        left: 25,
        right: 25
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
        this.applyGravity();
        this.startVisualLoop();
    }

    /**
     * Loads boss images.
     * @returns {void}
     */
    loadBossImages() {
        const allFrames = [
            this.watchFrames,
            this.stepFrames,
            this.painFrames,
            this.fallFrames
        ];

        allFrames.forEach(frames => this.loadImages(frames));
    }

    /**
     * Starts boss image loop.
     * @returns {void}
     */
    startVisualLoop() {
        setInterval(() => this.updateBossImage(), 180);
    }

    /**
     * Updates boss image.
     * @returns {void}
     */
    updateBossImage() {
        if (this.isDead()) return this.playAnimation(this.fallFrames);
        if (this.isHurt()) return this.playAnimation(this.painFrames);
        if (this.isInFightMode) return this.playAnimation(this.stepFrames);

        this.playAnimation(this.watchFrames);
    }

    /**
     * Moves boss closer to player.
     * @param {number} playerX Player x position.
     * @returns {void}
     */
    approachPlayer(playerX) {
        if (this.isDead() || this.isLeaping) return;

        const stopX = playerX + 110;
        const nextX = this.x - this.movingSpeed;

        this.x = nextX > stopX ? nextX : stopX;
        this.otherDirection = false;
    }

    /**
     * Starts leap attack.
     * @returns {void}
     */
    beginLeapAttack() {
        if (!this.canStartLeap()) return;

        this.isLeaping = true;
        this.speedY = 20;
        this.runLeapMovement();
    }

    /**
     * Checks leap start.
     * @returns {boolean}
     */
    canStartLeap() {
        return this.world && !this.isDead() && !this.isLeaping;
    }

    /**
     * Runs leap movement.
     * @returns {void}
     */
    runLeapMovement() {
        const timer = setInterval(() => {
            if (this.shouldFinishLeap()) {
                clearInterval(timer);
                this.isLeaping = false;
                return;
            }

            this.x -= this.leapSpeed;
            this.otherDirection = false;
        }, 1000 / 80);
    }

    /**
     * Checks leap finish.
     * @returns {boolean}
     */
    shouldFinishLeap() {
        const player = this.world ? this.world.character : null;
        const landed = !this.isAboveGround() && this.speedY === 0;

        return this.isDead() || !player || this.isColliding(player) || landed;
    }

    /**
     * Reduces boss health.
     * @returns {void}
     */
    hit() {
        this.healthValue = Math.max(0, this.healthValue - this.bottleDamage);

        if (this.healthValue > 0) {
            this.lastHit = Date.now();
        }
    }

    /**
     * Checks if boss is dead.
     * @returns {boolean}
     */
    isDead() {
        return this.healthValue <= 0;
    }
}