/**
 * Controls the active game world, collisions, drawing and game events.
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
     * Creates the active game world.
     * @param {HTMLCanvasElement} canvas Game canvas.
     * @param {Keyboard} keyboard Shared keyboard object.
     * @param {GameAudio} gameAudio Audio controller.
     */
    constructor(canvas, keyboard, gameAudio) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.keyboard = keyboard;
        this.gameAudio = gameAudio;
        this.setupWorld();
        this.endbossManager = new EndbossManager(this);
        this.startLoop();
        this.render();
    }

    /**
     * Connects objects with this world.
     * @returns {void}
     */
    setupWorld() {
        this.character.world = this;

        for (let i = 0; i < this.level.enemies.length; i++) {
            const enemy = this.level.enemies[i];
            if (enemy instanceof Endboss) enemy.world = this;
        }
    }

    /**
     * Starts world checks.
     * @returns {void}
     */
    startLoop() {
        this.loopId = setInterval(() => {
            if (!this.gameOver && !this.paused) this.runChecks();
        }, 1000 / 60);
    }

    /**
     * Runs all world logic.
     * @returns {void}
     */
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

    /**
     * Throws one bottle.
     * @returns {void}
     */
    checkThrow() {
        if (!this.keyboard.D || this.bottleCount <= 0) return;

        let x = this.character.otherDirection ? this.character.x + 25 : this.character.x + 95;
        this.flyingBottles.push(new ThrowableObject(x, this.character.y + 145, this.character.otherDirection));
        this.bottleCount--;
        this.keyboard.D = false;
        this.updateBottleBar();
    }

    /**
     * Checks enemy contacts.
     * @returns {void}
     */
    checkEnemies() {
        for (let i = 0; i < this.level.enemies.length; i++) {
            const enemy = this.level.enemies[i];
            if (this.shouldSkipEnemy(enemy) || !this.character.isColliding(enemy)) continue;
            this.isJumpHit(enemy) ? this.removeEnemy(enemy, i, true) : this.damagePlayer();
        }
    }

    /**
     * Checks whether an enemy should be ignored.
     * @param {MovableObject} enemy Enemy object.
     * @returns {boolean} True if enemy should be skipped.
     */
    shouldSkipEnemy(enemy) {
        return enemy.dead || enemy.isDefeated || enemy instanceof Endboss;
    }

    /**
     * Checks jump hit.
     * @param {MovableObject} enemy Enemy object.
     * @returns {boolean} True if hit from above.
     */
    isJumpHit(enemy) {
        const playerBottom = this.character.y + this.character.height - (this.character.offset?.bottom || 0);
        const enemyTop = enemy.y + (enemy.offset?.top || 0);
        const tolerance = enemy instanceof ChickenSmall ? 115 : 80;

        return this.character.speedY < 0 && playerBottom <= enemyTop + tolerance;
    }

    /**
     * Damages player.
     * @returns {void}
     */
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
     * @returns {void}
     */
    removeEnemy(enemy, index, bounce = false) {
        enemy.dead = true;
        enemy.isDefeated = true;
        enemy.die?.() || enemy.defeat?.() || enemy.kill?.();
        if (bounce) this.character.speedY = 28;

        this.playSound("enemyKill");
        window.setTimeout(() => this.level.enemies.splice(index, 1), 275);
    }

    /**
     * Checks collectibles.
     * @returns {void}
     */
    checkCollectibles() {
        this.checkBottleCollection();
        this.checkCoinCollection();
    }

    /**
     * Checks bottle collection.
     * @returns {void}
     */
    checkBottleCollection() {
        for (let i = this.bottleItems.length - 1; i >= 0; i--) {
            if (!this.character.isColliding(this.bottleItems[i])) continue;
            this.bottleItems.splice(i, 1);
            this.bottleCount++;
            this.updateBottleBar();
            this.playSound("bottleCollect");
        }
    }

    /**
     * Checks coin collection.
     * @returns {void}
     */
    checkCoinCollection() {
        for (let i = this.coinItems.length - 1; i >= 0; i--) {
            if (!this.character.isColliding(this.coinItems[i])) continue;
            this.coinItems.splice(i, 1);
            this.coinCount++;
            this.updateCoinBar();
            this.playSound("coinCollect");
        }
    }

    /**
     * Updates bottle bar.
     * @returns {void}
     */
    updateBottleBar() {
        this.bottleBar.setBottlePercentage(Math.min(this.bottleCount * 25, 100));
    }

    /**
     * Updates coin bar.
     * @returns {void}
     */
    updateCoinBar() {
        const total = this.coinCount + this.coinItems.length;
        const value = total ? Math.min((this.coinCount / total) * 100, 100) : 0;
        this.coinBar.setBottlePercentage(value);
    }

    /**
     * Checks bottle hits.
     * @returns {void}
     */
    checkBottleHits() {
        for (let b = 0; b < this.flyingBottles.length; b++) {
            const bottle = this.flyingBottles[b];
            if (!bottle.broken && !bottle.markedForRemoval) this.checkBottleAgainstEnemies(bottle);
        }
    }

    /**
     * Checks one bottle against enemies.
     * @param {ThrowableObject} bottle Flying bottle.
     * @returns {void}
     */
    checkBottleAgainstEnemies(bottle) {
        for (let e = this.level.enemies.length - 1; e >= 0; e--) {
            const enemy = this.level.enemies[e];
            if (enemy.dead || enemy.isDefeated || !bottle.isColliding(enemy)) continue;
            this.handleBottleHit(bottle, enemy, e);
            break;
        }
    }

    /**
     * Handles one bottle hit.
     * @param {ThrowableObject} bottle Thrown bottle.
     * @param {MovableObject} enemy Enemy object.
     * @param {number} index Enemy index.
     * @returns {void}
     */
    handleBottleHit(bottle, enemy, index) {
        bottle.breakBottle?.(false, false);
        this.playSound("bottleBreak");

        if (enemy instanceof Endboss) {
            this.endbossManager.handleBottleHit(enemy);
            this.playSound("endbossHit");
            return;
        }

        this.removeEnemy(enemy, index);
    }

    /**
     * Removes inactive bottles.
     * @returns {void}
     */
    cleanBottles() {
        for (let i = this.flyingBottles.length - 1; i >= 0; i--) {
            const bottle = this.flyingBottles[i];
            if (!bottle.markedForRemoval) continue;
            bottle.dispose?.();
            this.flyingBottles.splice(i, 1);
        }
    }

    /**
     * Plays one audio effect.
     * @param {string} name Effect name.
     * @returns {void}
     */
    playSound(name) {
        this.gameAudio?.playEffect?.(name);
    }

    /**
     * Draws the world.
     * @returns {void}
     */
    render() {
        if (this.gameOver || this.paused) return;

        this.clearCanvas();
        this.ctx.save();
        this.ctx.translate(this.camera_x, 0);
        this.drawWorldContent();
        this.ctx.restore();
        this.drawGroup([this.lifeBar, this.bottleBar, this.coinBar, this.bossBar]);
        window.requestAnimationFrame(() => this.render());
    }

    /**
     * Draws movable world content.
     * @returns {void}
     */
    drawWorldContent() {
        this.drawGroup(this.level.backgroundObjects);
        this.drawGroup(this.level.clouds);
        this.drawGroup(this.flyingBottles);
        this.drawGroup(this.bottleItems);
        this.drawGroup(this.coinItems);
        this.drawGroup(this.level.enemies);
        this.drawObject(this.character);
    }

    /**
     * Clears canvas.
     * @returns {void}
     */
    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    /**
     * Draws object group.
     * @param {DrawableObject[]} group Drawable objects.
     * @returns {void}
     */
    drawGroup(group) {
        if (!group) return;
        group.forEach(object => this.drawObject(object));
    }

    /**
     * Draws one object.
     * @param {DrawableObject} object Drawable object.
     * @returns {void}
     */
    drawObject(object) {
        if (!object) return;
        if (!object.otherDirection) return this.drawNormalObject(object);
        this.drawFlippedObject(object);
    }

    /**
     * Draws one normal object.
     * @param {DrawableObject} object Drawable object.
     * @returns {void}
     */
    drawNormalObject(object) {
        object.draw(this.ctx);
        object.drawFrame?.(this.ctx);
    }

    /**
     * Draws one flipped object.
     * @param {DrawableObject} object Drawable object.
     * @returns {void}
     */
    drawFlippedObject(object) {
        this.ctx.save();
        this.ctx.translate(object.width, 0);
        this.ctx.scale(-1, 1);
        object.x = object.x * -1;
        this.drawNormalObject(object);
        object.x = object.x * -1;
        this.ctx.restore();
    }

    /**
     * Stops world and opens result screen later.
     * @param {Function} screenFunction Screen function.
     * @param {number} delay Delay.
     * @returns {void}
     */
    finishWorld(screenFunction, delay = 310) {
        this.gameOver = true;
        window.setTimeout(() => screenFunction?.(), delay);
    }
}