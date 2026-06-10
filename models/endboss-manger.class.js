/**
 * Boss manager.
 */
class EndbossManager {
    world;
    jumpStop = false;
    contactStop = false;
    lastAnswerTime = 0;

    /**
     * Creates the manager.
     * @param {World} world Current world.
     */
    constructor(world) {
        this.world = world;
    }

    /**
     * Updates boss logic.
     * @returns {void}
     */
    updateBoss() {
        const boss = this.findEndboss();
        if (!this.canUseBoss(boss)) return;

        const player = this.world.character;
        const distance = this.measureDistance(boss, player);

        this.startFightMode(boss, distance);
        this.moveBossCloser(boss, player, distance);
        this.tryLeapAttack(boss, distance);
    }

    /**
     * Finds endboss.
     * @returns {Endboss|null}
     */
    findEndboss() {
        return this.world.level.enemies.find(enemy => enemy instanceof Endboss) || null;
    }

    /**
     * Checks if boss can act.
     * @param {Endboss|null} boss Boss object.
     * @returns {boolean}
     */
    canUseBoss(boss) {
        return boss && !boss.isDead() && !this.world.gameOver;
    }

    /**
     * Measures distance.
     * @param {Endboss} boss Boss object.
     * @param {Character} player Player object.
     * @returns {number}
     */
    measureDistance(boss, player) {
        return Math.abs(boss.x - player.x);
    }

    /**
     * Starts fight mode.
     * @param {Endboss} boss Boss object.
     * @param {number} distance Distance.
     * @returns {void}
     */
    startFightMode(boss, distance) {
        if (distance < 500) {
            boss.isInFightMode = true;
        }
    }

    /**
     * Moves boss closer.
     * @param {Endboss} boss Boss object.
     * @param {Character} player Player object.
     * @param {number} distance Distance.
     * @returns {void}
     */
    moveBossCloser(boss, player, distance) {
        if (!boss.isInFightMode) return;
        if (this.jumpStop || boss.isLeaping) return;
        if (distance <= 120) return;

        boss.approachPlayer(player.x);
    }

    /**
     * Starts leap attack if close.
     * @param {Endboss} boss Boss object.
     * @param {number} distance Distance.
     * @returns {void}
     */
    tryLeapAttack(boss, distance) {
        if (!boss.isInFightMode) return;
        if (this.jumpStop || boss.isLeaping) return;
        if (distance >= 170) return;

        this.lockJumpShortly();
        boss.beginLeapAttack();
    }

    /**
     * Locks jump for a short time.
     * @returns {void}
     */
    lockJumpShortly() {
        this.jumpStop = true;

        window.setTimeout(() => {
            this.jumpStop = false;
        }, 1400);
    }

    /**
     * Handles bottle hit.
     * @param {Endboss} boss Boss object.
     * @returns {void}
     */
    handleBottleHit(boss) {
        if (!this.canUseBoss(boss)) return;

        boss.hit();
        this.world.bossBar.setPercentage(boss.healthValue);

        if (boss.isDead()) {
            this.prepareWinScreen();
            return;
        }

        this.answerAfterDamage(boss);
    }

    /**
     * Boss reacts after damage.
     * @param {Endboss} boss Boss object.
     * @returns {void}
     */
    answerAfterDamage(boss) {
        const now = Date.now();

        if (now - this.lastAnswerTime < 500) return;

        this.lastAnswerTime = now;
        this.tryLeapAttack(boss, 0);
    }

    /**
     * Checks boss contact.
     * @returns {void}
     */
    checkBossContact() {
        const boss = this.findEndboss();
        if (!this.canUseBoss(boss)) return;
        if (this.contactStop) return;

        const player = this.world.character;
        if (!player.isColliding(boss)) return;
        if (player.isHurt()) return;

        this.hitPlayer(player, boss);
    }

    /**
     * Damages player.
     * @param {Character} player Player object.
     * @param {Endboss} boss Boss object.
     * @returns {void}
     */
    hitPlayer(player, boss) {
        this.contactStop = true;

        player.hit(25);
        this.world.lifeBar.setPercentage(player.energy);

        if (typeof player.startKnockback === "function") {
            player.startKnockback(-60, 18, 10);
        }

        this.keepPlayerOutside(player, boss);
        this.freeContactLater();
    }

    /**
     * Keeps player outside boss.
     * @param {Character} player Player object.
     * @param {Endboss} boss Boss object.
     * @returns {void}
     */
    keepPlayerOutside(player, boss) {
        const safeX = boss.x - player.width - 10;

        if (player.x > safeX) {
            player.x = safeX;
        }
    }

    /**
     * Unlocks contact.
     * @returns {void}
     */
    freeContactLater() {
        window.setTimeout(() => {
            this.contactStop = false;
        }, 450);
    }

    /**
     * Opens win screen.
     * @returns {void}
     */
    prepareWinScreen() {
        this.world.bossBar.setPercentage(0);
        this.world.flyingBottles = [];

        window.setTimeout(() => {
            this.world.finishWorld(showWinScreen, 0);
        }, 500);
    }
}