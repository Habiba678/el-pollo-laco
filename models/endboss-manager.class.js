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

    /** Updates boss logic. */
    updateBoss() {
        const boss = this.findEndboss();
        if (!this.canUseBoss(boss)) return;

        const player = this.world.character;
        const distance = this.measureDistance(boss, player);

        this.startFightMode(boss, distance);
        this.moveBossCloser(boss, player, distance);
        this.tryLeapAttack(boss, distance);
    }

    /** Finds endboss. */
    findEndboss() {
        return this.world.level.enemies.find(enemy => enemy instanceof Endboss) || null;
    }

    /** Checks if boss can act. */
    canUseBoss(boss) {
        return boss && !boss.isDead() && !this.world.gameOver;
    }

    /** Measures distance. */
    measureDistance(boss, player) {
        return Math.abs(boss.x - player.x);
    }

    /** Starts fight mode. */
    startFightMode(boss, distance) {
        if (distance < 500) boss.isInFightMode = true;
    }

    /** Moves boss closer. */
    moveBossCloser(boss, player, distance) {
        if (!boss.isInFightMode) return;
        if (this.jumpStop || boss.isLeaping) return;
        if (distance <= 120) return;

        boss.approachPlayer(player.x);
    }

    /** Starts leap attack if close. */
    tryLeapAttack(boss, distance) {
        if (!boss.isInFightMode) return;
        if (this.jumpStop || boss.isLeaping) return;
        if (distance >= 170) return;

        this.lockJumpShortly();
        boss.beginLeapAttack();
    }

    /** Locks jump shortly. */
    lockJumpShortly() {
        this.jumpStop = true;
        window.setTimeout(() => this.jumpStop = false, 1400);
    }

    /** Handles bottle hit. */
    handleBottleHit(boss) {
        if (!this.canUseBoss(boss)) return;

        boss.hit();
        this.playSound("endbossHit");
        this.world.bossBar.setPercentage(boss.healthValue);

        if (boss.isDead()) return this.prepareWinScreen();

        this.answerAfterDamage(boss);
    }

    /** Boss reacts after damage. */
    answerAfterDamage(boss) {
        const now = Date.now();
        if (now - this.lastAnswerTime < 500) return;

        this.lastAnswerTime = now;
        this.tryLeapAttack(boss, 0);
    }

    /** Checks boss contact. */
    checkBossContact() {
        const boss = this.findEndboss();
        if (!this.canUseBoss(boss) || this.contactStop) return;

        const player = this.world.character;
        if (!player.isColliding(boss) || player.isHurt()) return;

        this.hitPlayer(player, boss);
    }

    /** Damages player. */
    hitPlayer(player, boss) {
        this.contactStop = true;
        player.hit(25);
        this.playSound("characterHit");
        this.world.lifeBar.setPercentage(player.energy);

        player.startKnockback?.(-60, 18, 10);
        this.keepPlayerOutside(player, boss);
        this.freeContactLater();
    }

    /** Keeps player outside boss. */
    keepPlayerOutside(player, boss) {
        const safeX = boss.x - player.width - 10;
        if (player.x > safeX) player.x = safeX;
    }

    /** Unlocks contact. */
    freeContactLater() {
        window.setTimeout(() => this.contactStop = false, 450);
    }

    /** Plays one sound. */
    playSound(name) {
        this.world?.playSound?.(name);
    }

    /** Opens win screen. */
    prepareWinScreen() {
        this.world.bossBar.setPercentage(0);
        this.world.flyingBottles = [];

        window.setTimeout(() => {
            this.world.finishWorld(showWinScreen, 0);
        }, 500);
    }
}