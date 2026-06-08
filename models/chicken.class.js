/**
 * Represents a normal chicken enemy that moves through the level.
 */
class Chicken extends MovableObject {
    x = 850 + Math.random() * 650;
    y = 350;
    width = 120;
    height = 80;
    speed = 0.18 + Math.random() * 0.32;
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
     * Creates a normal chicken and starts its behavior.
     * @returns {void}
     */
    constructor() {
        super();
        this.loadImage(this.walkingImages[0]);
        this.loadImages(this.walkingImages);
        this.loadImages([this.defeatImage]);
        this.applyGravity();
        this.startBehavior();
    }

    /**
     * Starts movement and animation loops.
     * @returns {void}
     */
    startBehavior() {
        setInterval(() => this.moveEnemy(), 1000 / 60);
        setInterval(() => this.playWalkCycle(), 210);
    }

    /**
     * Moves the chicken while it is active.
     * @returns {void}
     */
    moveEnemy() {
        if (this.isDefeated) return;
        this.moveLeft();
    }

    /**
     * Plays the walking animation while active.
     * @returns {void}
     */
    playWalkCycle() {
        if (this.isDefeated) return;
        this.playAnimation(this.walkingImages);
    }

    /**
     * Switches the chicken into defeated state.
     * @returns {void}
     */
    defeat() {
        this.isDefeated = true;
        this.speed = 0;
        this.img = this.imageCache[this.defeatImage];
    }

    /**
     * Keeps support for kill calls.
     * @returns {void}
     */
    kill() {
        this.defeat();
    }

    /**
     * Keeps support for die calls.
     * @returns {void}
     */
    die() {
        this.defeat();
    }

    /**
     * Checks if this chicken is already defeated.
     * @returns {boolean} True if the chicken is defeated.
     */
    isDead() {
        return this.isDefeated;
    }
}