/**
 * Represents a normal chicken enemy that walks through the level
 * and can switch into a defeated state.
 */
class Chicken extends MovableObject {
    x = 450;
    y = 350;
    width = 120;
    height = 80;
    speed = 0.15 + Math.random() * 0.35;
    isDefeated = false;

    offset = {
        top: 6,
        bottom: 6,
        left: 10,
        right: 10
    };

    walkingImages = [
        "./assets/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png",
        "./assets/img/3_enemies_chicken/chicken_normal/1_walk/2_w.png",
        "./assets/img/3_enemies_chicken/chicken_normal/1_walk/3_w.png"
    ];

    defeatImage = "./assets/img/3_enemies_chicken/chicken_normal/2_dead/dead.png";

    /**
     * Creates the chicken, loads its images and starts movement.
     */
    constructor() {
        super();
        this.loadImage(this.walkingImages[0]);
        this.loadImages(this.walkingImages);
        this.loadImages([this.defeatImage]);
        this.applyGravity();
        this.startLoops();
    }

    /**
     * Starts movement and animation loops.
     * @returns {void}
     */
    startLoops() {
        setInterval(() => this.moveChicken(), 1000 / 60);
        setInterval(() => this.animateChicken(), 200);
    }

    /**
     * Moves the chicken to the left while it is alive.
     * @returns {void}
     */
    moveChicken() {
        if (this.isDefeated) return;

        this.moveLeft();
    }

    /**
     * Plays the walking animation while the chicken is alive.
     * @returns {void}
     */
    animateChicken() {
        if (this.isDefeated) return;

        this.playAnimation(this.walkingImages);
    }

    /**
     * Changes the chicken into its defeated state.
     * @returns {void}
     */
    defeat() {
        this.isDefeated = true;
        this.speed = 0;
        this.img = this.imageCache[this.defeatImage];
    }

    /**
     * Keeps compatibility with older code that calls kill().
     * @returns {void}
     */
    kill() {
        this.defeat();
    }

    /**
     * Checks whether the chicken is defeated.
     * @returns {boolean} True if the chicken is defeated.
     */
    isDead() {
        return this.isDefeated;
    }
}