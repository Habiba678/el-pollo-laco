/**
 * Enemy chicken that walks through the level and can be defeated.
 */
class Chicken extends MovableObject {
    x = 1000 + Math.random() * 500;
    y = 360;
    width = 120;
    height = 70;
    speed = 0.1 + Math.random() * 0.45;
    isDefeated = false;

    offset = {
        top: 8,
        bottom: 8,
        left: 10,
        right: 10
    };

    walkingImages = [
        "./assets/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png",
        "./assets/img/3_enemies_chicken/chicken_normal/1_walk/2_w.png",
        "./assets/img/3_enemies_chicken/chicken_normal/1_walk/3_w.png"
    ];

    defeatImage = "./assets/img/3_enemies_chicken/chicken_normal/2_dead/dead.png";

    constructor() {
        super();
        this.loadImage(this.walkingImages[0]);
        this.loadImages(this.walkingImages);
        this.loadImages([this.defeatImage]);
        this.applyGravity();
        this.startChickenMovement();
        this.startChickenAnimation();
    }

    /**
     * Moves the chicken to the left while it is active.
     */
    startChickenMovement() {
        setInterval(() => {
            if (!this.isDefeated) {
                this.moveLeft();
            }
        }, 1000 / 60);
    }

    /**
     * Plays the chicken walk animation while it is active.
     */
    startChickenAnimation() {
        setInterval(() => {
            if (!this.isDefeated) {
                this.playAnimation(this.walkingImages);
            }
        }, 200);
    }

    /**
     * Stops the chicken and shows the defeated image.
     */
    defeat() {
        this.isDefeated = true;
        this.speed = 0;
        this.img = this.imageCache[this.defeatImage];
    }
}