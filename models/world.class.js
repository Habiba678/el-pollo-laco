/**
 * Controls the active game world.
 */
class World {
    canvas;
    ctx;
    keyboard;
    gameAudio;
    camera_x = 0;
    gameOver = false;
    paused = false;
    loopId = null;
    endbossManager;

    level = createLevel1();
    character = new Character();

    lifeBar = new StatusBar("health", 20, 20);
    bottleBar = new StatusBar("bottle", 20, 60);
    coinBar = new StatusBar("coins", 20, 100);
    bossBar = new StatusBar("boss", 500, 20);

    flyingBottles = [];
    bottleCount = 0;
    coinCount = 0;

    bottleItems = [
        new CollectibleObject(260, 350),
        new CollectibleObject(520, 350),
        new CollectibleObject(690, 350),
        new CollectibleObject(950, 350),
        new CollectibleObject(1080, 350),
        new CollectibleObject(1280, 350),
        new CollectibleObject(1420, 350),
        new CollectibleObject(1650, 350)
    ];

    coinItems = [
        new CollectibleObject(430, 245, "coin"),
        new CollectibleObject(650, 230, "coin"),
        new CollectibleObject(810, 220, "coin"),
        new CollectibleObject(1020, 250, "coin"),
        new CollectibleObject(1190, 265, "coin"),
        new CollectibleObject(1390, 230, "coin"),
        new CollectibleObject(1570, 235, "coin"),
        new CollectibleObject(1780, 250, "coin"),
        new CollectibleObject(1980, 225, "coin")
    ];

    /**
     * Creates the game world.
     * @param {HTMLCanvasElement} canvas Game canvas.
     * @param {Keyboard} keyboard Shared keyboard.
     * @param {GameAudio} gameAudio Audio controller.
     */
    constructor(canvas, keyboard, gameAudio) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d", { willReadFrequently: true });
        this.keyboard = keyboard;
        this.gameAudio = gameAudio;
        this.setupWorld();
        this.endbossManager = new EndbossManager(this);
        this.startLoop();
        this.render();
    }

    /** Connects world references. */
    setupWorld() {
        this.character.world = this;

        for (let enemy of this.level.enemies) {
            if (enemy instanceof Endboss) enemy.world = this;
        }
    }

    /** Starts world checks. */
    startLoop() {
        this.loopId = setInterval(() => {
            if (!this.gameOver && !this.paused) this.runChecks();
        }, 1000 / 60);
    }

    /** Runs all checks. */
    runChecks() {
        this.endbossManager.updateBoss();
        this.endbossManager.checkBossContact();
        this.checkEnemies();
        this.checkCollectibles();
        this.checkThrow();
        this.checkBottleHits();
        this.cleanBottles();
        if (this.character.energy <= 0) this.finishWorld(showGameOverScreen, 310);
    }

    /** Throws one bottle. */
    checkThrow() {
        if (!this.keyboard.D || this.bottleCount <= 0) return;

        const x = this.character.otherDirection ? this.character.x + 25 : this.character.x + 95;
        const y = this.character.y + 145;

        this.flyingBottles.push(new ThrowableObject(x, y, this.character.otherDirection));
        this.bottleCount--;
        this.keyboard.D = false;
        this.updateBottleBar();
    }

    /** Checks enemy collisions. */
    checkEnemies() {
        for (let i = 0; i < this.level.enemies.length; i++) {
            const enemy = this.level.enemies[i];
            if (this.shouldSkipEnemy(enemy) || !this.character.isColliding(enemy)) continue;
            this.isJumpHit(enemy) ? this.removeEnemy(enemy, i, true) : this.damagePlayer();
        }
    }

    /**
     * Checks if enemy is ignored.
     * @param {MovableObject} enemy Enemy object.
     * @returns {boolean} True if ignored.
     */
    shouldSkipEnemy(enemy) {
        return enemy.dead || enemy.isDefeated || enemy instanceof Endboss;
    }

    /**
     * Checks jump hit.
     * @param {MovableObject} enemy Enemy object.
     * @returns {boolean} True if jumped on enemy.
     */
    isJumpHit(enemy) {
        const bottom = this.character.y + this.character.height - (this.character.offset?.bottom || 0);
        const top = enemy.y + (enemy.offset?.top || 0);
        const tolerance = enemy instanceof ChickenSmall ? 115 : 80;

        return this.character.speedY < 0 && bottom <= top + tolerance;
    }

    /** Damages the player. */
    damagePlayer() {
        if (this.character.isHurt()) return;

        this.character.hit(35);
        this.lifeBar.setPercentage(this.character.energy);
        this.playSound("characterHit");
    }

    /**
     * Removes one enemy.
     * @param {MovableObject} enemy Enemy object.
     * @param {number} index Enemy index.
     * @param {boolean} bounce Player bounce.
     */
    removeEnemy(enemy, index, bounce = false) {
        enemy.dead = true;
        enemy.isDefeated = true;
        enemy.die?.() || enemy.defeat?.() || enemy.kill?.();
        if (bounce) this.character.speedY = 28;

        this.playSound("enemyKill");
        window.setTimeout(() => this.level.enemies.splice(index, 1), 275);
    }

    /** Checks all collectibles. */
    checkCollectibles() {
        this.collectItems(this.bottleItems, "bottle");
        this.collectItems(this.coinItems, "coin");
    }

    /**
     * Collects item group.
     * @param {CollectibleObject[]} items Item list.
     * @param {string} type Item type.
     */
    collectItems(items, type) {
        for (let i = items.length - 1; i >= 0; i--) {
            if (!this.character.isColliding(items[i])) continue;
            items.splice(i, 1);
            this.updateCollectedItem(type);
        }
    }

    /**
     * Updates collected item.
     * @param {string} type Item type.
     */
    updateCollectedItem(type) {
        type === "bottle" ? this.bottleCount++ : this.coinCount++;
        type === "bottle" ? this.updateBottleBar() : this.updateCoinBar();
        this.playSound(type === "bottle" ? "bottleCollect" : "coinCollect");
    }

    /** Updates bottle bar. */
    updateBottleBar() {
        this.bottleBar.setBottlePercentage(Math.min(this.bottleCount * 25, 100));
    }

    /** Updates coin bar. */
    updateCoinBar() {
        const total = this.coinCount + this.coinItems.length;
        const value = total ? Math.min((this.coinCount / total) * 100, 100) : 0;
        this.coinBar.setBottlePercentage(value);
    }

    /** Checks bottle hits. */
    checkBottleHits() {
        for (let bottle of this.flyingBottles) {
            if (!bottle.broken && !bottle.markedForRemoval) {
                this.checkBottleEnemies(bottle);
            }
        }
    }

    /**
     * Checks bottle against enemies.
     * @param {ThrowableObject} bottle Flying bottle.
     */
    checkBottleEnemies(bottle) {
        for (let i = this.level.enemies.length - 1; i >= 0; i--) {
            const enemy = this.level.enemies[i];
            if (enemy.dead || enemy.isDefeated || !bottle.isColliding(enemy)) continue;
            this.handleBottleHit(bottle, enemy, i);
            break;
        }
    }

    /**
     * Handles one bottle hit.
     * @param {ThrowableObject} bottle Thrown bottle.
     * @param {MovableObject} enemy Enemy object.
     * @param {number} index Enemy index.
     */
    handleBottleHit(bottle, enemy, index) {
        bottle.breakBottle?.(false, false);
        this.playSound("bottleBreak");

        if (enemy instanceof Endboss) return this.hitEndboss(enemy);
        this.removeEnemy(enemy, index);
    }

    /**
     * Hits the endboss.
     * @param {Endboss} enemy Endboss object.
     */
    hitEndboss(enemy) {
        this.endbossManager.handleBottleHit(enemy);
        this.playSound("endbossHit");
    }

    /** Removes inactive bottles. */
    cleanBottles() {
        for (let i = this.flyingBottles.length - 1; i >= 0; i--) {
            const bottle = this.flyingBottles[i];
            if (!bottle.markedForRemoval) continue;
            bottle.dispose?.();
            this.flyingBottles.splice(i, 1);
        }
    }

    /**
     * Plays one sound.
     * @param {string} name Sound name.
     */
    playSound(name) {
        this.gameAudio?.playEffect?.(name);
    }

    /** Draws the world. */
    render() {
        if (this.gameOver || this.paused) return;

        this.clearCanvas();
        this.ctx.save();
        this.ctx.translate(this.camera_x, 0);
        this.drawWorldObjects();
        this.ctx.restore();
        this.drawGroup([this.lifeBar, this.bottleBar, this.coinBar, this.bossBar]);
        window.requestAnimationFrame(() => this.render());
    }

    /** Draws all world objects. */
    drawWorldObjects() {
        const groups = [
            this.level.backgroundObjects,
            this.level.clouds,
            this.flyingBottles,
            this.bottleItems,
            this.coinItems,
            this.level.enemies
        ];

        groups.forEach(group => this.drawGroup(group));
        this.drawObject(this.character);
    }

    /** Clears canvas. */
    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    /**
     * Draws one group.
     * @param {DrawableObject[]} group Object group.
     */
    drawGroup(group) {
        if (!group) return;

        for (let i = 0; i < group.length; i++) {
            this.drawObject(group[i]);
        }
    }

    /**
     * Draws one object.
     * @param {DrawableObject} object Drawable object.
     */
    drawObject(object) {
        if (!object) return;
        if (!object.otherDirection) return object.draw(this.ctx);

        this.drawFlippedObject(object);
    }

    /**
     * Draws one flipped object.
     * @param {DrawableObject} object Drawable object.
     */
    drawFlippedObject(object) {
        this.ctx.save();
        this.ctx.translate(object.width, 0);
        this.ctx.scale(-1, 1);
        object.x = object.x * -1;
        object.draw(this.ctx);
        object.x = object.x * -1;
        this.ctx.restore();
    }

    /**
     * Stops world and opens screen.
     * @param {Function} screenFunction Screen function.
     * @param {number} delay Delay.
     */
    finishWorld(screenFunction, delay = 310) {
        this.gameOver = true;
        window.setTimeout(() => screenFunction?.(), delay);
    }
}