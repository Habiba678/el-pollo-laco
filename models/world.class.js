class World {
    canvas;
    ctx;
    keyboard;
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
        new CollectibleObject(690, 350),
        new CollectibleObject(1080, 350),
        new CollectibleObject(1420, 350)
    ];

    coinItems = [
        new CollectibleObject(430, 245, "coin"),
        new CollectibleObject(810, 220, "coin"),
        new CollectibleObject(1190, 265, "coin"),
        new CollectibleObject(1570, 235, "coin")
    ];

    /**
     * Creates the active game world.
     * @param {HTMLCanvasElement} canvas Game canvas.
     * @param {Keyboard} keyboard Shared keyboard object.
     */
    constructor(canvas, keyboard) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.keyboard = keyboard;
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
            if (this.gameOver || this.paused) return;
            this.runChecks();
        }, 125);
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

        if (this.character.energy <= 0) {
            this.finishWorld(showGameOverScreen, 310);
        }
    }

    /**
     * Throws one bottle.
     * @returns {void}
     */
    checkThrow() {
        if (!this.keyboard.D || this.bottleCount <= 0) return;

        let x = this.character.x + 95;
        if (this.character.otherDirection) x = this.character.x + 25;

        this.flyingBottles.push(
            new ThrowableObject(x, this.character.y + 125, this.character.otherDirection)
        );

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
            if (!this.character.isColliding(enemy)) continue;

            if (enemy instanceof Endboss) {
                continue;
            }

            if (this.isJumpHit(enemy)) {
                this.removeEnemy(enemy, i, true);
            } else {
                this.damagePlayer();
            }
        }
    }

    /**
     * Checks jump hit.
     * @param {MovableObject} enemy Enemy object.
     * @returns {boolean} True if hit from above.
     */
    isJumpHit(enemy) {
        if (this.character.speedY >= 0) return false;

        const feet = this.character.y + this.character.height - this.character.offset.bottom;
        const head = enemy.y + (enemy.offset?.top || 0);
        const limit = enemy instanceof ChickenSmall ? 98 : 58;

        return feet <= head + limit;
    }

    /**
     * Damages player.
     * @returns {void}
     */
    damagePlayer() {
        if (this.character.isHurt()) return;

        this.character.hit(35);
        this.lifeBar.setPercentage(this.character.energy);
    }

    /**
     * Removes one enemy.
     * @param {MovableObject} enemy Enemy object.
     * @param {number} index Enemy index.
     * @param {boolean} bounce Player bounce.
     * @returns {void}
     */
    removeEnemy(enemy, index, bounce = false) {
        if (typeof enemy.die === "function") enemy.die();
        else if (typeof enemy.defeat === "function") enemy.defeat();
        else if (typeof enemy.kill === "function") enemy.kill();

        if (bounce) this.character.speedY = 24;

        const remove = () => this.level.enemies.splice(index, 1);
        window.setTimeout(remove, 275);
    }

    /**
     * Checks items.
     * @returns {void}
     */
    checkCollectibles() {
        for (let i = this.bottleItems.length - 1; i >= 0; i--) {
            if (!this.character.isColliding(this.bottleItems[i])) continue;
            this.bottleItems.splice(i, 1);
            this.bottleCount++;
            this.updateBottleBar();
        }

        for (let i = this.coinItems.length - 1; i >= 0; i--) {
            if (!this.character.isColliding(this.coinItems[i])) continue;
            this.coinItems.splice(i, 1);
            this.coinCount++;
            this.updateCoinBar();
        }
    }

    /**
     * Updates bottle bar.
     * @returns {void}
     */
    updateBottleBar() {
        let value = this.bottleCount * 25;
        if (value > 100) value = 100;
        this.bottleBar.setBottlePercentage(value);
    }

    /**
     * Updates coin bar.
     * @returns {void}
     */
    updateCoinBar() {
        const total = this.coinCount + this.coinItems.length;

        if (total === 0) {
            this.coinBar.setBottlePercentage(0);
            return;
        }

        let value = (this.coinCount / total) * 100;
        if (value > 100) value = 100;
        this.coinBar.setBottlePercentage(value);
    }

    /**
     * Checks bottle hits.
     * @returns {void}
     */
    checkBottleHits() {
        for (let b = 0; b < this.flyingBottles.length; b++) {
            const bottle = this.flyingBottles[b];
            if (bottle.broken || bottle.markedForRemoval) continue;

            for (let e = this.level.enemies.length - 1; e >= 0; e--) {
                const enemy = this.level.enemies[e];
                if (!bottle.isColliding(enemy)) continue;
                this.handleBottleHit(bottle, enemy, e);
                break;
            }
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
        if (typeof bottle.breakBottle === "function") {
            bottle.breakBottle(false, false);
        }

        if (enemy instanceof Endboss) {
            this.endbossManager.handleBottleHit(enemy);
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
            if (typeof bottle.dispose === "function") bottle.dispose();

            this.flyingBottles.splice(i, 1);
        }
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

        this.drawGroup(this.level.backgroundObjects);
        this.drawGroup(this.level.clouds);
        this.drawGroup(this.flyingBottles);
        this.drawGroup(this.bottleItems);
        this.drawGroup(this.coinItems);
        this.drawGroup(this.level.enemies);
        this.drawObject(this.character);

        this.ctx.restore();
        this.drawGroup([this.lifeBar, this.bottleBar, this.coinBar, this.bossBar]);

        window.requestAnimationFrame(() => this.render());
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

        for (let i = 0; i < group.length; i++) {
            this.drawObject(group[i]);
        }
    }

    /**
     * Draws one object.
     * @param {DrawableObject} object Drawable object.
     * @returns {void}
     */
    drawObject(object) {
        if (!object) return;

        if (!object.otherDirection) {
            object.draw(this.ctx);
            if (typeof object.drawFrame === "function") object.drawFrame(this.ctx);
            return;
        }

        this.ctx.save();
        this.ctx.translate(object.width, 0);
        this.ctx.scale(-1, 1);
        object.x = object.x * -1;
        object.draw(this.ctx);
        if (typeof object.drawFrame === "function") object.drawFrame(this.ctx);
        object.x = object.x * -1;
        this.ctx.restore();
    }

    /**
     * Stops world.
     * @param {Function} screenFunction Screen function.
     * @param {number} delay Delay.
     * @returns {void}
     */
    finishWorld(screenFunction, delay = 310) {
        this.gameOver = true;

        const openScreen = () => {
            if (typeof screenFunction !== "function") return;
            screenFunction();
        };

        window.setTimeout(openScreen, delay);
    }
}