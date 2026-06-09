/**
 * Salsa bottle that can be thrown.
 */
class ThrowableObject extends MovableObject {
    floorLine = 360;
    broken = false;
    markedForRemoval = false;
    movementTimer = null;

    bottleImage = "./assets/img/6_salsa_bottle/salsa_bottle.png";
    splashImage = "./assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png";

    /**
     * Builds a bottle at the throw position.
     * @param {number} x Start x position.
     * @param {number} y Start y position.
     * @param {boolean} otherDirection True when flying left.
     */
    constructor(x, y, otherDirection = false) {
        super();
        this.x = x;
        this.y = y;
        this.width = 100;
        this.height = 60;
        this.otherDirection = otherDirection;

        this.loadImage(this.bottleImage);
        this.loadImages([this.splashImage]);
        this.beginFlight();
    }

    /**
     * Gives the bottle gravity and movement.
     * @returns {void}
     */
    beginFlight() {
        this.speedY = 30;
        this.applyGravity();

        this.movementTimer = setInterval(() => {
            this.moveInAir();
        }, 1000 / 50);
    }

    /**
     * Moves the bottle one step.
     * @returns {void}
     */
    moveInAir() {
        if (this.broken) return;

        let nextX = this.x + 10;

        if (this.otherDirection) {
            nextX = this.x - 10;
        }

        this.x = nextX;

        if (this.isOnFloor()) {
            this.breakBottle();
        }
    }

    /**
     * Checks the ground contact.
     * @returns {boolean} True if the bottle touches the ground.
     */
    isOnFloor() {
        if (this.y < this.floorLine) return false;
        if (this.speedY > 0) return false;

        return true;
    }

    /**
     * Switches the bottle into splash mode.
     * @returns {void}
     */
    breakBottle() {
        if (this.broken) return;

        this.broken = true;
        this.speedY = 0;
        this.stopMovement();
        this.showSplashImage();
    }

    /**
     * Shows the broken bottle image.
     * @returns {void}
     */
    showSplashImage() {
        this.y = this.floorLine;
        this.img = this.imageCache[this.splashImage];

        const removeBottle = () => {
            this.markedForRemoval = true;
        };

        window.setTimeout(removeBottle, 180);
    }

    /**
     * Stops the movement timer.
     * @returns {void}
     */
    stopMovement() {
        if (!this.movementTimer) return;

        clearInterval(this.movementTimer);
        this.movementTimer = null;
    }

    /**
     * Stops open timers before removing.
     * @returns {void}
     */
    dispose() {
        this.stopMovement();
    }
}