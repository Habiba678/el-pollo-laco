class Character extends MovableObject {
    world;

    x = 100;
    y = 165;
    width = 100;
    height = 250;
    speed = 10;

    offset = {
        top: 60,
        bottom: 10,
        left: 25,
        right: 25
    };

    IMAGES_IDLE = [
        "./assets/img/2_character_pepe/1_idle/idle/I-1.png",
        "./assets/img/2_character_pepe/1_idle/idle/I-2.png",
        "./assets/img/2_character_pepe/1_idle/idle/I-3.png",
        "./assets/img/2_character_pepe/1_idle/idle/I-6.png",
        "./assets/img/2_character_pepe/1_idle/idle/I-7.png",
        "./assets/img/2_character_pepe/1_idle/idle/I-8.png",
        "./assets/img/2_character_pepe/1_idle/idle/I-9.png",
        "./assets/img/2_character_pepe/1_idle/idle/I-10.png"
    ];

    IMAGES_WALKING = [
        "./assets/img/2_character_pepe/2_walk/W-21.png",
        "./assets/img/2_character_pepe/2_walk/W-22.png",
        "./assets/img/2_character_pepe/2_walk/W-23.png",
        "./assets/img/2_character_pepe/2_walk/W-24.png",
        "./assets/img/2_character_pepe/2_walk/W-25.png",
        "./assets/img/2_character_pepe/2_walk/W-26.png"
    ];

    IMAGES_JUMPING = [
        "./assets/img/2_character_pepe/3_jump/J-31.png",
        "./assets/img/2_character_pepe/3_jump/J-32.png",
        "./assets/img/2_character_pepe/3_jump/J-33.png",
        "./assets/img/2_character_pepe/3_jump/J-34.png",
        "./assets/img/2_character_pepe/3_jump/J-35.png",
        "./assets/img/2_character_pepe/3_jump/J-36.png",
        "./assets/img/2_character_pepe/3_jump/J-37.png",
        "./assets/img/2_character_pepe/3_jump/J-38.png",
        "./assets/img/2_character_pepe/3_jump/J-39.png"
    ];

    IMAGES_HURT = [
        "./assets/img/2_character_pepe/4_hurt/H-41.png",
        "./assets/img/2_character_pepe/4_hurt/H-42.png",
        "./assets/img/2_character_pepe/4_hurt/H-43.png"
    ];

    IMAGES_DEAD = [
        "./assets/img/2_character_pepe/5_dead/D-51.png",
        "./assets/img/2_character_pepe/5_dead/D-52.png",
        "./assets/img/2_character_pepe/5_dead/D-53.png",
        "./assets/img/2_character_pepe/5_dead/D-54.png",
        "./assets/img/2_character_pepe/5_dead/D-55.png",
        "./assets/img/2_character_pepe/5_dead/D-56.png",
        "./assets/img/2_character_pepe/5_dead/D-57.png"
    ];

    constructor() {
        super();
        this.loadImage(this.IMAGES_IDLE[0]);
        this.loadCharacterImages();
        this.applyGravity();
        this.startMovement();
        this.startAnimation();
    }

    /**
     * Loads all character image groups.
     */
    loadCharacterImages() {
        this.loadImages(this.IMAGES_IDLE);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_JUMPING);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_DEAD);
    }

    /**
     * Starts the movement loop.
     */
    startMovement() {
        setInterval(() => {
            if (!this.world) return;

            this.moveByKeyboard();
            this.jumpByKeyboard();
            this.updateCamera();
        }, 1000 / 60);
    }

    /**
     * Handles left and right movement.
     */
    moveByKeyboard() {
        if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
            this.moveRight();
            this.otherDirection = false;
        }

        if (this.world.keyboard.LEFT && this.x > 0) {
            this.moveLeft();
            this.otherDirection = true;
        }
    }

    /**
     * Handles jump input.
     */
    jumpByKeyboard() {
        if (this.world.keyboard.SPACE) {
            this.jump();
        }
    }

    /**
     * Updates camera position.
     */
    updateCamera() {
        this.world.camera_x = -this.x + 100;
    }

    /**
     * Starts the animation loop.
     */
    startAnimation() {
        setInterval(() => {
            this.playCurrentAnimation();
        }, 80);
    }

    /**
     * Chooses the correct animation.
     */
    playCurrentAnimation() {
        if (this.isDead()) {
            this.playAnimation(this.IMAGES_DEAD);
        } else if (this.isHurt()) {
            this.playAnimation(this.IMAGES_HURT);
        } else if (this.isAboveGround()) {
            this.playAnimation(this.IMAGES_JUMPING);
        } else if (this.isMoving()) {
            this.playAnimation(this.IMAGES_WALKING);
        } else {
            this.playAnimation(this.IMAGES_IDLE);
        }
    }

    /**
     * Checks if the character is walking.
     * @returns {boolean}
     */
    isMoving() {
        if (!this.world) return false;

        return this.world.keyboard.RIGHT || this.world.keyboard.LEFT;
    }
}