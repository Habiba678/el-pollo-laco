/**
 * Represents a throwable salsa bottle.
 */
class ThrowableObject extends MovableObject {
    groundLevel = 360;
    broken = false;
    markedForRemoval = false;
    moveInterval = null;
    splashImage = './assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png';

    /**
     * Creates a throwable bottle.
     * @param {number} x Start x-position.
     * @param {number} y Start y-position.
     * @param {boolean} otherDirection True if the bottle should fly left.
     */
    constructor(x, y, otherDirection = false) {
        super();
        this.loadImage('./assets/img/6_salsa_bottle/salsa_bottle.png');
        this.loadImages([this.splashImage]);

        this.x = x;
        this.y = y;
        this.width = 100;
        this.height = 60;
        this.otherDirection = otherDirection;

        this.startThrow();
    }

    /**
     * Starts the bottle movement.
     * @returns {void}
     */
    startThrow() {
        this.speedY = 30;
        this.applyGravity();

        this.moveInterval = setInterval(() => {
            if (this.broken) return;

            this.x += this.otherDirection ? -10 : 10;

            if (this.hasTouchedGround()) {
                this.breakBottle();
            }
        }, 1000 / 50);
    }

    /**
     * Checks if the bottle has reached the ground.
     * @returns {boolean} True if the bottle touched the ground.
     */
    hasTouchedGround() {
        return this.y >= this.groundLevel && this.speedY <= 0;
    }

    /**
     * Changes the bottle into its broken state.
     * @returns {void}
     */
    breakBottle() {
        if (this.broken) return;

        this.broken = true;
        this.speedY = 0;
        this.stopMovement();
        this.showSplash();
    }

    /**
     * Shows the splash image for a short time.
     * @returns {void}
     */
    showSplash() {
        this.y = this.groundLevel;
        this.img = this.imageCache[this.splashImage];

        setTimeout(() => {
            this.markedForRemoval = true;
        }, 180);
    }

    /**
     * Stops bottle movement.
     * @returns {void}
     */
    stopMovement() {
        if (!this.moveInterval) return;

        clearInterval(this.moveInterval);
        this.moveInterval = null;
    }

    /**
     * Cleans up the bottle.
     * @returns {void}
     */
    dispose() {
        this.stopMovement();
    }
}
    