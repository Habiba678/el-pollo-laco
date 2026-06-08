/**
 * Represents a small chicken enemy in the level.
 */
class ChickenSmall extends MovableObject {
    x = 620 + Math.random() * 700;
    y = 385;
    groundLevel = 385;
    width = 70;
    height = 55;
    speed = 0.25 + Math.random() * 0.3;
    isDefeated = false;

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
     * Creates a small chicken, loads its images and starts its behavior.
     */
    constructor() {
        super();
        this.loadImage(this.walkingImages[0]);
        this.loadImages(this.walkingImages);
        this.loadImages([this.defeatImage]);
        this.startBehavior();
    }

    /**
     * Starts movement and animation loops.
     * @returns {void}
     */
    startBehavior() {
        setInterval(() => this.moveSmallChicken(), 1000 / 60);
        setInterval(() => this.animateSmallChicken(), 200);
    }

    /**
     * Moves the small chicken while it is active.
     * @returns {void}
     */
    moveSmallChicken() {
        if (this.isDefeated) return;

        this.moveLeft();
    }

    /**
     * Plays the walking animation while the chicken is active.
     * @returns {void}
     */
    animateSmallChicken() {
        if (this.isDefeated) return;

        this.playAnimation(this.walkingImages);
    }

    /**
     * Switches the small chicken into defeated state.
     * @returns {void}
     */
    defeat() {
        this.isDefeated = true;
        this.speed = 0;
        this.img = this.imageCache[this.defeatImage];
    }

    /**
     * Keeps compatibility with older code that calls die().
     * @returns {void}
     */
    die() {
        this.defeat();
    }

    /**
     * Keeps compatibility with older code that calls kill().
     * @returns {void}
     */
    kill() {
        this.defeat();
    }

    /**
     * Checks whether the small chicken is defeated.
     * @returns {boolean} True if the small chicken is defeated.
     */
    isDead() {
        return this.isDefeated;
    }
}