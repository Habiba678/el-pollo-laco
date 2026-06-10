/**
 * Controls the player character, movement, animations and audio.
 */
class Character extends MovableObject {
    world;

    x = 80;
    y = 180;
    width = 100;
    height = 250;
    speed = 10;
    groundY = 180;

    offset = { top: 60, bottom: 10, left: 25, right: 25 };

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

    idleCounter = 0;
    jumpFrame = 0;
    knockbackTimer = null;
    isKnockedBack = false;

    /**
     * Creates the character.
     */
    constructor() {
        super();
        this.loadImage(this.idleImages[0]);
        this.loadCharacterImages();
        this.applyGravity();
        this.startLoops();
    }

    /**
     * Loads all character image groups.
     * @returns {void}
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
     * Starts character loops.
     * @returns {void}
     */
    startLoops() {
        setInterval(() => this.updateMovement(), 1000 / 60);
        setInterval(() => this.updateAnimation(), 80);
    }

    /**
     * Updates movement and camera.
     * @returns {void}
     */
    updateMovement() {
        if (!this.world || this.world.gameOver) return;

        this.stopWalkAudio();
        this.moveByInput();
        this.jumpByInput();
        this.world.camera_x = -this.x + 100;
    }

    /**
     * Handles movement keys.
     * @returns {void}
     */
    moveByInput() {
        if (this.isKnockedBack) return;

        this.handleSideMove("RIGHT");
        this.handleSideMove("LEFT");
    }

    /**
     * Handles one movement direction.
     * @param {string} direction Movement direction.
     * @returns {void}
     */
    handleSideMove(direction) {
        if (!this.canMoveSide(direction)) return;

        direction === "RIGHT" ? this.moveRight() : this.moveLeft();
        this.otherDirection = direction === "LEFT";
        this.playWalkAudio();
        this.resetIdle();
    }

    /**
     * Checks side movement.
     * @param {string} direction Movement direction.
     * @returns {boolean} True if movement is allowed.
     */
    canMoveSide(direction) {
        if (direction === "RIGHT") {
            return this.world.keyboard.RIGHT &&
                this.x < this.world.level.level_end_x &&
                !this.isBossBlocking();
        }

        return this.world.keyboard.LEFT && this.x > 0;
    }

    /**
     * Handles jump input.
     * @returns {void}
     */
    jumpByInput() {
        if (this.isKnockedBack) return;
        if (!this.world.keyboard.SPACE || this.isAboveGround()) return;

        this.jump();
        this.playJumpAudio();
        this.resetIdle();
        this.jumpFrame = 0;
    }

    /**
     * Checks air state.
     * @returns {boolean} True if character is above ground.
     */
    isAboveGround() {
        return this.y < this.groundY;
    }

    /**
     * Starts jump.
     * @returns {void}
     */
    jump() {
        this.speedY = 32;
    }

    /**
     * Checks boss blocking.
     * @returns {boolean} True if boss blocks.
     */
    isBossBlocking() {
        const boss = this.world?.endbossManager?.findEndboss();

        if (!boss || typeof boss.isDead !== "function" || boss.isDead()) {
            return false;
        }

        return this.isNearBossSide(boss) && this.hasBossHeightOverlap(boss);
    }

    /**
     * Checks horizontal boss block.
     * @param {Endboss} boss Boss object.
     * @returns {boolean} True if boss is in front.
     */
    isNearBossSide(boss) {
        const characterRight = this.x + this.width - this.offset.right;
        const bossLeft = boss.x + (boss.offset?.left || 0);

        return characterRight + this.speed >= bossLeft && this.x < boss.x;
    }

    /**
     * Checks vertical boss overlap.
     * @param {Endboss} boss Boss object.
     * @returns {boolean} True if vertical overlap exists.
     */
    hasBossHeightOverlap(boss) {
        const characterTop = this.y + this.offset.top;
        const characterBottom = this.y + this.height - this.offset.bottom;
        const bossTop = boss.y + (boss.offset?.top || 0);
        const bossBottom = boss.y + boss.height - (boss.offset?.bottom || 0);

        return characterBottom > bossTop && characterTop < bossBottom;
    }

    /**
     * Updates character animation.
     * @returns {void}
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
     * Plays jump animation.
     * @returns {void}
     */
    playJumpAnimation() {
        const index = Math.min(this.jumpFrame, this.jumpingImages.length - 1);

        this.img = this.imageCache[this.jumpingImages[index]];
        if (this.jumpFrame < this.jumpingImages.length - 1) this.jumpFrame++;
    }

    /**
     * Plays idle animation.
     * @returns {void}
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
     * Checks movement state.
     * @returns {boolean} True if character is moving.
     */
    isMoving() {
        return this.world.keyboard.LEFT ||
            this.world.keyboard.RIGHT ||
            this.isKnockedBack;
    }

    /**
     * Resets idle timer.
     * @returns {void}
     */
    resetIdle() {
        this.idleCounter = 0;
    }

    /**
     * Plays walking sound.
     * @returns {void}
     */
    playWalkAudio() {
        this.playCharacterSound("run");
    }

    /**
     * Stops walking sound.
     * @returns {void}
     */
    stopWalkAudio() {
        if (!this.world?.gameAudio) return;

        this.world.gameAudio.stopEffect("run");
    }

    /**
     * Plays jump sound.
     * @returns {void}
     */
    playJumpAudio() {
        this.playCharacterSound("jump");
    }

    /**
     * Plays one character sound.
     * @param {string} name Sound name.
     * @returns {void}
     */
    playCharacterSound(name) {
        if (!this.world?.gameAudio) return;

        this.world.gameAudio.playEffect(name);
    }

    /**
     * Starts knockback.
     * @param {number} distance Push distance.
     * @param {number} jumpPower Jump power.
     * @param {number} steps Movement steps.
     * @returns {void}
     */
    startKnockback(distance = 120, jumpPower = 26, steps = 12) {
        this.stopKnockback();
        this.isKnockedBack = true;
        this.speedY = jumpPower;
        this.runKnockback(distance, steps);
    }

    /**
     * Runs knockback movement.
     * @param {number} distance Push distance.
     * @param {number} steps Movement steps.
     * @returns {void}
     */
    runKnockback(distance, steps) {
        const stepDistance = distance / steps;
        let currentStep = 0;

        this.knockbackTimer = setInterval(() => {
            currentStep = this.moveKnockbackStep(stepDistance, currentStep, steps);
        }, 1000 / 60);
    }

    /**
     * Moves one knockback step.
     * @param {number} stepDistance Step distance.
     * @param {number} currentStep Current step.
     * @param {number} steps Max steps.
     * @returns {number} Updated step.
     */
    moveKnockbackStep(stepDistance, currentStep, steps) {
        this.x = Math.max(0, this.x - stepDistance);
        currentStep++;

        if (currentStep >= steps) this.stopKnockback();

        return currentStep;
    }

    /**
     * Stops knockback.
     * @returns {void}
     */
    stopKnockback() {
        if (this.knockbackTimer) {
            clearInterval(this.knockbackTimer);
            this.knockbackTimer = null;
        }

        this.isKnockedBack = false;
    }
}