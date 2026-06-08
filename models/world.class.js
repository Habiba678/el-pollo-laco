class World {
    ctx;
    canvas;
    keyboard;
    camera_x = 0;

    level = createLevel1();
    character = new Character();
    statusBar = new StatusBar();

    throwableObjects = [];

    bottles = [
        new CollectibleObject(250, 350),
        new CollectibleObject(650, 350),
        new CollectibleObject(950, 350)
    ];

    coins = [
        new CollectibleObject(400, 250, "coin"),
        new CollectibleObject(750, 220, "coin"),
        new CollectibleObject(1100, 260, "coin")
    ];

    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext("2d");
        this.canvas = canvas;
        this.keyboard = keyboard;

        this.setWorldReference();
        this.startWorldChecks();
        this.draw();
    }

    setWorldReference() {
        this.character.world = this;
    }

    startWorldChecks() {
        setInterval(() => {
            this.checkEnemyContact();
            this.checkCollectibles();
            this.checkBottleThrow();
            this.checkBottleHits();
        }, 200);
    }

    checkBottleThrow() {
        if (!this.keyboard.D) return;

        const bottle = new ThrowableObject(
            this.character.x + 100,
            this.character.y + 100,
            this.character.otherDirection
        );

        this.throwableObjects.push(bottle);
        this.keyboard.D = false;
    }

    checkEnemyContact() {
        this.level.enemies.forEach((enemy) => {
            if (!this.character.isColliding(enemy)) return;

            this.character.hit();
            this.statusBar.setPercentage(this.character.energy);
        });
    }

    checkCollectibles() {
        this.removeCollectedItems(this.bottles);
        this.removeCollectedItems(this.coins);
    }

    removeCollectedItems(items) {
        for (let index = items.length - 1; index >= 0; index--) {
            if (this.character.isColliding(items[index])) {
                items.splice(index, 1);
            }
        }
    }

    checkBottleHits() {
        this.throwableObjects.forEach((bottle) => {
            this.level.enemies.forEach((enemy) => {
                this.handleBottleEnemyContact(bottle, enemy);
            });
        });
    }

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

    draw() {
        this.clearCanvas();
        this.drawBackgroundArea();
        this.drawGameArea();
        this.drawScreenArea();

        requestAnimationFrame(() => this.draw());
    }

    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawBackgroundArea() {
        this.addObjectsToMap(this.level.backgroundObjects);
        this.addObjectsToMap(this.level.clouds);
    }

    drawGameArea() {
        this.ctx.translate(this.camera_x, 0);

        this.addObjectsToMap(this.throwableObjects);
        this.addObjectsToMap(this.bottles);
        this.addObjectsToMap(this.coins);
        this.addObjectsToMap(this.level.enemies);
        this.addToMap(this.character);

        this.ctx.translate(-this.camera_x, 0);
    }

    drawScreenArea() {
        this.addToMap(this.statusBar);
    }

    addObjectsToMap(objects) {
        if (!objects) return;

        objects.forEach((object) => this.addToMap(object));
    }

    addToMap(object) {
        if (!object) return;

        if (object.otherDirection) {
            this.flipImage(object);
        }

        object.draw(this.ctx);

        if (typeof object.drawFrame === "function") {
            object.drawFrame(this.ctx);
        }

        if (object.otherDirection) {
            this.flipImageBack(object);
        }
    }

    flipImage(object) {
        this.ctx.save();
        this.ctx.translate(object.width, 0);
        this.ctx.scale(-1, 1);
        object.x = object.x * -1;
    }

    flipImageBack(object) {
        object.x = object.x * -1;
        this.ctx.restore();
    }
}