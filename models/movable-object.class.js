/**
 * Base class for all moving game objects.
 */
class MovableObject extends DrawableObject {
    speed = 0.15;
    otherDirection = false;
    speedY = 0;
    acceleration = 2.5;
    energy = 100;
    lastHit = 0;
    groundY = 180;

    /**
     * Applies gravity to the object.
     */
    applyGravity() {
        setInterval(() => {
            if (this.isAboveGround() || this.speedY > 0) {
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
                this.keepOnGround();
            }
        }, 1000 / 25);
    }

    /**
     * Keeps the object from falling below the ground.
     */
    keepOnGround() {
        if (!(this instanceof ThrowableObject) && this.y > this.groundY) {
            this.y = this.groundY;
            this.speedY = 0;
        }
    }

    /**
     * Checks if the object is above the ground.
     * @returns {boolean}
     */
    isAboveGround() {
        if (this instanceof ThrowableObject) {
            return true;
        }

        return this.y < this.groundY;
    }

    /**
     * Checks if this object touches another object.
     * @param {MovableObject} object Object to compare with.
     * @returns {boolean}
     */
    isColliding(object) {
        return this.getRightSide() > object.getLeftSide() &&
            this.getBottomSide() > object.getTopSide() &&
            this.getLeftSide() < object.getRightSide() &&
            this.getTopSide() < object.getBottomSide();
    }

    /**
     * Gets the left collision side.
     * @returns {number}
     */
    getLeftSide() {
        return this.x + (this.offset?.left || 0);
    }

    /**
     * Gets the right collision side.
     * @returns {number}
     */
    getRightSide() {
        return this.x + this.width - (this.offset?.right || 0);
    }

    /**
     * Gets the top collision side.
     * @returns {number}
     */
    getTopSide() {
        return this.y + (this.offset?.top || 0);
    }

    /**
     * Gets the bottom collision side.
     * @returns {number}
     */
    getBottomSide() {
        return this.y + this.height - (this.offset?.bottom || 0);
    }

    /**
     * Reduces the object energy.
     * @param {number} damage Amount of damage.
     */
    hit(damage = 5) {
        this.energy -= damage;

        if (this.energy < 0) {
            this.energy = 0;
        }

        if (this.energy > 0) {
            this.lastHit = Date.now();
        }
    }

    /**
     * Checks if the object was hit recently.
     * @returns {boolean}
     */
    isHurt() {
        const secondsSinceHit = (Date.now() - this.lastHit) / 1000;
        return secondsSinceHit < 1;
    }

    /**
     * Checks if the object has no energy left.
     * @returns {boolean}
     */
    isDead() {
        return this.energy === 0;
    }

    /**
     * Sets the object energy to zero.
     */
    kill() {
        this.energy = 0;
    }

    /**
     * Plays an animation from image paths.
     * @param {string[]} images Animation image paths.
     */
    playAnimation(images) {
        const imageIndex = this.currentImage % images.length;
        const imagePath = images[imageIndex];

        this.img = this.imageCache[imagePath];
        this.currentImage++;
    }

    /**
     * Moves the object to the right.
     */
    moveRight() {
        this.x += this.speed;
    }

    /**
     * Moves the object to the left.
     */
    moveLeft() {
        this.x -= this.speed;
    }

    /**
     * Makes the object jump if it is on the ground.
     * @param {number} force Jump strength.
     */
    jump(force = 30) {
        if (!this.isAboveGround()) {
            this.speedY = force;
        }
    }
}