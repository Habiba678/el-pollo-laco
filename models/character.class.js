class Character extends MovableObject {
    world;

    x = 100;
    y = 165;
    width = 100;
    height = 250;
    speed = 10;
    groundY = 165;

    offset = {
        top: 60,
        bottom: 10,
        left: 25,
        right: 25
    };

    idleImages = [
        "./assets/img/2_character_pepe/1_idle/idle/I-1.png",
        "./assets/img/2_character_pepe/1_idle/idle/I-2.png",
        "./assets/img/2_character_pepe/1_idle/idle/I-3.png",
        "./assets/img/2_character_pepe/1_idle/idle/I-6.png",
        "./assets/img/2_character_pepe/1_idle/idle/I-7.png",
        "./assets/img/2_character_pepe/1_idle/idle/I-8.png",
        "./assets/img/2_character_pepe/1_idle/idle/I-9.png",
        "./assets/img/2_character_pepe/1_idle/idle/I-10.png"
    ];

    longIdleImages = [
        "./assets/img/2_character_pepe/1_idle/long_idle/I-11.png",
        "./assets/img/2_character_pepe/1_idle/long_idle/I-12.png",
        "./assets/img/2_character_pepe/1_idle/long_idle/I-13.png",
        "./assets/img/2_character_pepe/1_idle/long_idle/I-14.png",
        "./assets/img/2_character_pepe/1_idle/long_idle/I-15.png",
        "./assets/img/2_character_pepe/1_idle/long_idle/I-16.png",
        "./assets/img/2_character_pepe/1_idle/long_idle/I-17.png",
        "./assets/img/2_character_pepe/1_idle/long_idle/I-18.png",
        "./assets/img/2_character_pepe/1_idle/long_idle/I-19.png",
        "./assets/img/2_character_pepe/1_idle/long_idle/I-20.png"
    ];

    walkingImages = [
        "./assets/img/2_character_pepe/2_walk/W-21.png",
        "./assets/img/2_character_pepe/2_walk/W-22.png",
        "./assets/img/2_character_pepe/2_walk/W-23.png",
        "./assets/img/2_character_pepe/2_walk/W-24.png",
        "./assets/img/2_character_pepe/2_walk/W-25.png",
        "./assets/img/2_character_pepe/2_walk/W-26.png"
    ];

    jumpingImages = [
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

    hurtImages = [
        "./assets/img/2_character_pepe/4_hurt/H-41.png",
        "./assets/img/2_character_pepe/4_hurt/H-42.png",
        "./assets/img/2_character_pepe/4_hurt/H-43.png"
    ];

    deadImages = [
        "./assets/img/2_character_pepe/5_dead/D-51.png",
        "./assets/img/2_character_pepe/5_dead/D-52.png",
        "./assets/img/2_character_pepe/5_dead/D-53.png",
        "./assets/img/2_character_pepe/5_dead/D-54.png",
        "./assets/img/2_character_pepe/5_dead/D-55.png",
        "./assets/img/2_character_pepe/5_dead/D-56.png",
        "./assets/img/2_character_pepe/5_dead/D-57.png"
    ];

    walkAudio = new Audio("./assets/audio/run.mp3");
    idleCounter = 0;
    jumpFrame = 0;
    knockbackTimer = null;
    isKnockedBack = false;

    constructor() {
        super();
        this.loadImage(this.idleImages[0]);
        this.loadCharacterImages();
        this.walkAudio.volume = 0.2;
        this.applyGravity();
        this.startLoops();
    }

    /**
     * Loads all character sprite groups.
     */
    loadCharacterImages() {
        this.loadImages(this.idleImages);
        this.loadImages(this.longIdleImages);
        this.loadImages(this.walkingImages);
        this.loadImages(this.jumpingImages);
        this.loadImages(this.hurtImages);
        this.loadImages(this.deadImages);
    }

    /**
     * Starts movement and animation loops.
     */
    startLoops() {
        setInterval(() => this.updateMovement(), 1000 / 60);
        setInterval(() => this.updateAnimation(), 80);
    }

    /**
     * Updates keyboard movement and camera.
     */
    updateMovement() {
        if (!this.world || this.world.gameOver) return;

        this.stopWalkAudio();
        this.moveByInput();
        this.jumpByInput();
        this.world.camera_x = -this.x + 100;
    }

    /**
     * Moves the character left or right.
     */
    moveByInput() {
        if (this.isKnockedBack) return;

        if (this.canMoveRight()) {
            this.moveRight();
            this.otherDirection = false;
            this.playWalkAudio();
            this.resetIdle();
        }

        if (this.canMoveLeft()) {
            this.moveLeft();
            this.otherDirection = true;
            this.playWalkAudio();
            this.resetIdle();
        }
    }

    /**
     * Checks right movement.
     * @returns {boolean}
     */
    canMoveRight() {
        const levelEnd = this.world?.level?.level_end_x || 2200;
        return this.world.keyboard.RIGHT && this.x < levelEnd && !this.isBossBlocking();
    }

    /**
     * Checks left movement.
     * @returns {boolean}
     */
    canMoveLeft() {
        return this.world.keyboard.LEFT && this.x > 0;
    }

    /**
     * Checks jump input.
     */
    jumpByInput() {
        if (this.isKnockedBack) return;

        if (this.world.keyboard.SPACE && !this.isAboveGround()) {
            this.jump();
            this.resetIdle();
            this.jumpFrame = 0;
        }
    }

    /**
     * Checks whether the character is above ground.
     * @returns {boolean}
     */
    isAboveGround() {
        return this.y < this.groundY;
    }

    /**
     * Starts a jump.
     */
    jump() {
        this.speedY = 30;
    }

    /**
     * Checks if the boss blocks the way.
     * @returns {boolean}
     */
    isBossBlocking() {
        const boss = this.world?.endbossManager?.endboss;
        if (!boss || typeof boss.isDead !== "function" || boss.isDead()) return false;

        const characterRight = this.x + this.width - this.offset.right;
        const bossLeft = boss.x + (boss.offset?.left || 0);

        const characterTop = this.y + this.offset.top;
        const characterBottom = this.y + this.height - this.offset.bottom;
        const bossTop = boss.y + (boss.offset?.top || 0);
        const bossBottom = boss.y + boss.height - (boss.offset?.bottom || 0);

        return characterRight + this.speed >= bossLeft &&
            this.x < boss.x &&
            characterBottom > bossTop &&
            characterTop < bossBottom;
    }

    /**
     * Updates the current animation.
     */
    updateAnimation() {
        if (!this.world || this.world.gameOver) return;

        if (this.isDead()) return this.playAnimation(this.deadImages);
        if (this.isHurt()) return this.playAnimation(this.hurtImages);
        if (this.isAboveGround()) return this.playJumpAnimation();
        if (this.isMoving()) return this.playAnimation(this.walkingImages);

        this.playIdleAnimation();
    }

    /**
     * Plays the jump animation step by step.
     */
    playJumpAnimation() {
        const index = Math.min(this.jumpFrame, this.jumpingImages.length - 1);
        this.img = this.imageCache[this.jumpingImages[index]];

        if (this.jumpFrame < this.jumpingImages.length - 1) {
            this.jumpFrame++;
        }
    }

    /**
     * Plays idle and long idle animation.
     */
    playIdleAnimation() {
        if (this.idleCounter < 30) {
            this.playAnimation(this.idleImages);
            this.idleCounter++;
            return;
        }

        this.playAnimation(this.longIdleImages);
    }

    /**
     * Checks if character is moving.
     * @returns {boolean}
     */
    isMoving() {
        return this.world.keyboard.LEFT || this.world.keyboard.RIGHT || this.isKnockedBack;
    }

    /**
     * Resets idle timer.
     */
    resetIdle() {
        this.idleCounter = 0;
    }

    /**
     * Plays walking audio safely.
     */
    playWalkAudio() {
        if (!this.walkAudio.paused) return;
        this.walkAudio.play().catch(() => {});
    }

    /**
     * Stops walking audio.
     */
    stopWalkAudio() {
        this.walkAudio.pause();
        this.walkAudio.currentTime = 0;
    }

    /**
     * Pushes the character backwards.
     * @param {number} distance Push distance.
     * @param {number} jumpPower Upward force.
     * @param {number} steps Amount of steps.
     */
    startKnockback(distance = 120, jumpPower = 26, steps = 12) {
        this.stopKnockback();
        this.isKnockedBack = true;
        this.speedY = jumpPower;

        const stepDistance = distance / steps;
        let currentStep = 0;

        this.knockbackTimer = setInterval(() => {
            this.x = Math.max(0, this.x - stepDistance);
            currentStep++;

            if (currentStep >= steps) {
                this.stopKnockback();
            }
        }, 1000 / 60);
    }

    /**
     * Stops knockback movement.
     */
    stopKnockback() {
        if (this.knockbackTimer) {
            clearInterval(this.knockbackTimer);
            this.knockbackTimer = null;
        }

        this.isKnockedBack = false;
    }
}