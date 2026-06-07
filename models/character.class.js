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
    knockbackTimer = null;
    isKnockedBack = false;

    constructor() {
        super();
        this.loadImage(this.idleImages[0]);
        this.loadCharacterImages();
        this.walkAudio.volume = 0.2;
        this.applyGravity();
        this.startCharacterLoops();
    }

    /**
     * Loads every animation group of the character.
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
     * Starts movement and animation intervals.
     */
    startCharacterLoops() {
        setInterval(() => this.updateCharacterMovement(), 1000 / 60);
        setInterval(() => this.updateCharacterAnimation(), 80);
    }

    /**
     * Updates movement, jump and camera.
     */
    updateCharacterMovement() {
        if (!this.world || this.world.gameOver) return;

        this.pauseWalkAudio();
        this.moveCharacterSideways();
        this.handleCharacterJump();
        this.moveCameraWithCharacter();
    }

    /**
     * Moves character left or right.
     */
    moveCharacterSideways() {
        if (this.isKnockedBack) return;

        if (this.canWalkRight()) {
            this.moveRight();
            this.otherDirection = false;
            this.playWalkAudio();
            this.resetIdleCounter();
        }

        if (this.canWalkLeft()) {
            this.moveLeft();
            this.otherDirection = true;
            this.playWalkAudio();
            this.resetIdleCounter();
        }
    }

    /**
     * Checks if character may move right.
     * @returns {boolean}
     */
    canWalkRight() {
        return this.world.keyboard.RIGHT &&
            this.x < this.world.level.level_end_x &&
            !this.isBlockedByBoss();
    }

    /**
     * Checks if character may move left.
     * @returns {boolean}
     */
    canWalkLeft() {
        return this.world.keyboard.LEFT && this.x > 0;
    }

    /**
     * Blocks walking into the boss body.
     * @returns {boolean}
     */
    isBlockedByBoss() {
        const boss = this.world?.endbossManager?.endboss;

        if (!boss || boss.isDead()) return false;

        const characterRight = this.getRightSide();
        const bossLeft = boss.getLeftSide ? boss.getLeftSide() : boss.x;

        const characterBottom = this.getBottomSide();
        const characterTop = this.getTopSide();
        const bossTop = boss.getTopSide ? boss.getTopSide() : boss.y;
        const bossBottom = boss.getBottomSide ? boss.getBottomSide() : boss.y + boss.height;

        const touchesVerticalArea = characterBottom > bossTop && characterTop < bossBottom;
        const reachesBoss = characterRight + this.speed >= bossLeft && this.x < boss.x;

        return touchesVerticalArea && reachesBoss;
    }

    /**
     * Handles jump input.
     */
    handleCharacterJump() {
        if (this.isKnockedBack) return;

        if (this.world.keyboard.SPACE && !this.isAboveGround()) {
            this.jump();
            this.resetIdleCounter();
        }
    }

    /**
     * Updates camera position.
     */
    moveCameraWithCharacter() {
        this.world.camera_x = -this.x + 100;
    }

    /**
     * Chooses current animation.
     */
    updateCharacterAnimation() {
        if (!this.world || this.world.gameOver) return;

        if (this.isDead()) {
            this.playAnimation(this.deadImages);
            return;
        }

        if (this.isHurt()) {
            this.playAnimation(this.hurtImages);
            return;
        }

        if (this.isAboveGround()) {
            this.playAnimation(this.jumpingImages);
            return;
        }

        if (this.isWalkingOrKnocked()) {
            this.playAnimation(this.walkingImages);
            return;
        }

        this.playIdleAnimation();
    }

    /**
     * Plays idle or long idle animation.
     */
    playIdleAnimation() {
        if (this.idleCounter < 30) {
            this.playAnimation(this.idleImages);
            this.idleCounter++;
        } else {
            this.playAnimation(this.longIdleImages);
        }
    }

    /**
     * Checks if character is walking or pushed back.
     * @returns {boolean}
     */
    isWalkingOrKnocked() {
        return this.world.keyboard.LEFT ||
            this.world.keyboard.RIGHT ||
            this.isKnockedBack;
    }

    /**
     * Resets idle timer.
     */
    resetIdleCounter() {
        this.idleCounter = 0;
    }

    /**
     * Plays walking sound if allowed.
     */
    playWalkAudio() {
        if (!this.walkAudio.paused) return;

        this.walkAudio.play().catch(() => {});
    }

    /**
     * Stops walking sound.
     */
    pauseWalkAudio() {
        this.walkAudio.pause();
        this.walkAudio.currentTime = 0;
    }

    /**
     * Pushes the character backwards for a short moment.
     * @param {number} distance Push distance.
     * @param {number} jumpPower Upward force.
     * @param {number} steps Amount of small movement steps.
     */
    startKnockback(distance = 120, jumpPower = 26, steps = 12) {
        this.stopKnockback();
        this.isKnockedBack = true;
        this.speedY = jumpPower;

        const stepDistance = distance / steps;
        let doneSteps = 0;

        this.knockbackTimer = setInterval(() => {
            this.x = Math.max(0, this.x - stepDistance);
            doneSteps++;

            if (doneSteps >= steps) {
                this.stopKnockback();
            }
        }, 1000 / 60);
    }

    /**
     * Stops current knockback.
     */
    stopKnockback() {
        if (this.knockbackTimer) {
            clearInterval(this.knockbackTimer);
            this.knockbackTimer = null;
        }

        this.isKnockedBack = false;
    }
}