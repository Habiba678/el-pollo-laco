class World {
    ctx;
    canvas;
    keyboard;
    camera_x = 0;

    level = level1;
    character = new Character();
    statusBar = new StatusBar();
    throwableObjects = [];

    /**
     * Creates the world and starts the game rendering.
     * @param {HTMLCanvasElement} canvas The canvas element.
     * @param {Keyboard} keyboard The current keyboard state.
     */
    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext("2d");
        this.canvas = canvas;
        this.keyboard = keyboard;

        this.setWorldReference();
        this.startWorldChecks();
        this.draw();
    }

    /**
     * Gives the character access to this world.
     */
    setWorldReference() {
        this.character.world = this;
    }

    /**
     * Starts repeated checks for collisions and throw actions.
     */
    startWorldChecks() {
        setInterval(() => {
            this.checkEnemyContact();
            this.checkCollectibles();
            this.checkBottleThrow();
            this.checkBottleHits();
        }, 200);
    }

    /**
     * Throws a bottle when the throw key is pressed.
     */
    checkBottleThrow() {
        if (!this.keyboard.D) return;

        const bottle = new ThrowableObject(
            this.character.x + 100,
            this.character.y + 100
        );

        this.throwableObjects.push(bottle);
        this.keyboard.D = false;
    }

    /**
     * Checks if the character touches an enemy.
     */
    checkEnemyContact() {
        this.level.enemies.forEach((enemy) => {
            if (!this.character.isColliding(enemy)) return;

            this.character.hit();
            this.statusBar.setPercentage(this.character.energy);
        });
    }

    /**
     * Checks collectible objects from the level.
     */
    checkCollectibles() {
        if (this.level.coins) {
            this.removeCollectedItems(this.level.coins);
        }
    }

    /**
     * Removes collected items from an array.
     * @param {DrawableObject[]} items The collectible items.
     */
    removeCollectedItems(items) {
        for (let index = items.length - 1; index >= 0; index--) {
            if (this.character.isColliding(items[index])) {
                items.splice(index, 1);
            }
        }
    }

    /**
     * Checks if thrown bottles hit enemies.
     */
    checkBottleHits() {
        this.throwableObjects.forEach((bottle) => {
            this.level.enemies.forEach((enemy) => {
                this.handleBottleEnemyContact(bottle, enemy);
            });
        });
    }

    /**
     * Handles one bottle and one enemy contact.
     * @param {ThrowableObject} bottle The thrown bottle.
     * @param {MovableObject} enemy The enemy.
     */
    handleBottleEnemyContact(bottle, enemy) {
        if (!bottle.isColliding(enemy)) return;

        if (typeof enemy.defeat === "function") {
            enemy.defeat();
            return;
        }

        if (typeof enemy.kill === "function") {
            enemy.kill();
        }
    }

    /**
     * Draws the complete world.
     */
    draw() {
        this.clearCanvas();
        this.drawBackgroundArea();
        this.drawGameArea();
        this.drawScreenArea();

        requestAnimationFrame(() => this.draw());
    }

    /**
     * Clears the canvas before drawing the next frame.
     */
    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    /**
     * Draws background and clouds.
     */
    drawBackgroundArea() {
        this.addObjectsToMap(this.level.clouds);
        this.addObjectsToMap(this.level.backgroundObjects);
    }

    /**
     * Draws all objects that move with the camera.
     */
    drawGameArea() {
        this.ctx.translate(this.camera_x, 0);

        this.addObjectsToMap(this.throwableObjects);
        this.addObjectsToMap(this.level.coins || []);
        this.addObjectsToMap(this.level.enemies);
        this.addToMap(this.character);

        this.ctx.translate(-this.camera_x, 0);
    }

    /**
     * Draws fixed screen elements.
     */
    drawScreenArea() {
        this.addToMap(this.statusBar);
    }

    /**
     * Draws several objects.
     * @param {DrawableObject[]} objects The objects to draw.
     */
    addObjectsToMap(objects) {
        objects.forEach((object) => this.addToMap(object));
    }

    /**
     * Draws one object on the map.
     * @param {DrawableObject} object The object to draw.
     */
    addToMap(object) {
        if (object.otherDirection) {
            this.flipImage(object);
        }

        object.draw(this.ctx);
        object.drawFrame(this.ctx);

        if (object.otherDirection) {
            this.flipImageBack(object);
        }
    }

    /**
     * Mirrors an object before drawing.
     * @param {DrawableObject} object The object to mirror.
     */
    flipImage(object) {
        this.ctx.save();
        this.ctx.translate(object.width, 0);
        this.ctx.scale(-1, 1);
        object.x = object.x * -1;
    }

    /**
     * Restores the object after mirrored drawing.
     * @param {DrawableObject} object The mirrored object.
     */
    flipImageBack(object) {
        object.x = object.x * -1;
        this.ctx.restore();
    }
}