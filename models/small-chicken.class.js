/**
 * Small chicken enemy.
 */
class ChickenSmall extends MovableObject {
    x = 620 + Math.random() * 700;
    y = 385;
    groundLevel = 385;
    width = 70;
    height = 55;
    speed = 0.25 + Math.random() * 0.3;
    isDefeated = false;
    moveTimer = null;
    imageTimer = null;

    offset = {
        top: 3,
        bottom: 3,
        left: 5,
        right: 5
    };

    walkingImages = [
        "./assets/img/3_enemies_chicken/chicken_small/1_walk/1_w.png",
        "./assets/img/3_enemies_chicken/chicken_small/1_walk/2_w.png",
        "./assets/img/3_enemies_chicken/chicken_small/1_walk/3_w.png"
    ];

    defeatImage = "./assets/img/3_enemies_chicken/chicken_small/2_dead/dead.png";

    /**
     * Creates the small chicken.
     */
    constructor() {
        super();
        this.prepareImages();
        this.startSmallChicken();
    }

    /**
     * Loads all images.
     * @returns {void}
     */
    prepareImages() {
        this.loadImage(this.walkingImages[0]);
        this.loadImages(this.walkingImages);
        this.loadImages([this.defeatImage]);
    }

    /**
     * Starts all updates.
     * @returns {void}
     */
    startSmallChicken() {
        this.startWalkingTimer();
        this.startSpriteTimer();
    }

    /**
     * Starts movement updates.
     * @returns {void}
     */
    startWalkingTimer() {
        this.moveTimer = setInterval(() => {
            this.updateWalk();
        }, 1000 / 60);
    }

    /**
     * Starts image updates.
     * @returns {void}
     */
    startSpriteTimer() {
        this.imageTimer = setInterval(() => {
            this.updateSprite();
        }, 200);
    }

    /**
     * Updates movement.
     * @returns {void}
     */
    updateWalk() {
        if (this.isDefeated) {
            return;
        }

        this.moveLeft();
    }

    /**
     * Updates animation.
     * @returns {void}
     */
    updateSprite() {
        if (this.isDefeated) {
            return;
        }

        const frames = this.walkingImages;
        this.playAnimation(frames);
    }

    /**
     * Changes to defeated state.
     * @returns {void}
     */
    defeat() {
        this.isDefeated = true;
        this.speed = 0;
        this.img = this.imageCache[this.defeatImage];
    }

    /**
     * Old defeat call.
     * @returns {void}
     */
    die() {
        this.defeat();
    }

    /**
     * Second defeat call.
     * @returns {void}
     */
    kill() {
        this.defeat();
    }

    /**
     * Checks defeat state.
     * @returns {boolean} True if defeated.
     */
    isDead() {
        if (this.isDefeated) {
            return true;
        }

        return false;
    }
}