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
     * Updates the boss.
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
     * @returns {Endboss|null} Found boss.
     */
    findEndboss() {
        let result = null;
        let index = 0;

        while (!result && index < this.world.level.enemies.length) {
            const enemy = this.world.level.enemies[index];

            if (enemy instanceof Endboss) {
                result = enemy;
            }

            index++;
        }

        return result;
    }

    /**
     * Checks boss state.
     * @param {Endboss|null} boss Boss object.
     * @returns {boolean} True if boss can act.
     */
    canUseBoss(boss) {
        if (!boss) return false;
        if (this.world.gameOver) return false;
        if (boss.isDead()) return false;

        return true;
    }

    /**
     * Measures distance.
     * @param {Endboss} boss Boss object.
     * @param {Character} player Player object.
     * @returns {number} Distance.
     */
    measureDistance(boss, player) {
        const distance = boss.x - player.x;

        if (distance < 0) {
            return distance * -1;
        }

        return distance;
    }

    /**
     * Starts fight mode.
     * @param {Endboss} boss Boss object.
     * @param {number} distance Distance.
     * @returns {void}
     */
    startFightMode(boss, distance) {
        if (distance > 1200) return;

        boss.isInFightMode = true;
    }

    /**
     * Moves boss.
     * @param {Endboss} boss Boss object.
     * @param {Character} player Player object.
     * @param {number} distance Distance.
     * @returns {void}
     */
    moveBossCloser(boss, player, distance) {
        if (!boss.isInFightMode) return;
        if (this.jumpStop) return;
        if (boss.isLeaping) return;
        if (distance < 145) return;

        boss.approachPlayer(player.x);
    }

    /**
     * Tries close attack.
     * @param {Endboss} boss Boss object.
     * @param {number} distance Distance.
     * @returns {void}
     */
    tryLeapAttack(boss, distance) {
        if (!boss.isInFightMode) return;
        if (this.jumpStop) return;
        if (boss.isLeaping) return;
        if (distance > 180) return;

        this.closeLeapForMoment();
        boss.beginLeapAttack();
    }

    /**
     * Adds leap pause.
     * @returns {void}
     */
    closeLeapForMoment() {
        this.jumpStop = true;

        const openAgain = () => {
            this.jumpStop = false;
        };

        window.setTimeout(openAgain, 1320);
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
     * Boss answer after hit.
     * @param {Endboss} boss Boss object.
     * @returns {void}
     */
    answerAfterDamage(boss) {
        const now = Date.now();
        const waitingTime = now - this.lastAnswerTime;

        if (waitingTime < 640) return;

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
     * Handles player damage.
     * @param {Character} player Player object.
     * @param {Endboss} boss Boss object.
     * @returns {void}
     */
    hitPlayer(player, boss) {
        this.contactStop = true;
        this.reducePlayerEnergy(player);
        this.pushPlayerAway(player);
        this.keepPlayerOutside(player, boss);
        this.freeContactLater();
    }

    /**
     * Reduces player energy.
     * @param {Character} player Player object.
     * @returns {void}
     */
    reducePlayerEnergy(player) {
        player.hit(24);
        this.world.lifeBar.setPercentage(player.energy);
    }

    /**
     * Pushes player away.
     * @param {Character} player Player object.
     * @returns {void}
     */
    pushPlayerAway(player) {
        if (typeof player.startKnockback !== "function") return;

        const push = {
            distance: 58,
            strength: 17,
            steps: 11
        };

        player.startKnockback(push.distance, push.strength, push.steps);
    }

    /**
     * Keeps player before boss.
     * @param {Character} player Player object.
     * @param {Endboss} boss Boss object.
     * @returns {void}
     */
    keepPlayerOutside(player, boss) {
        const allowedX = boss.x - player.width - 12;

        if (player.x <= allowedX) return;

        player.x = allowedX;
    }

    /**
     * Unlocks contact.
     * @returns {void}
     */
    freeContactLater() {
        const unlock = () => {
            this.contactStop = false;
        };

        window.setTimeout(unlock, 460);
    }

    /**
     * Opens win screen.
     * @returns {void}
     */
    prepareWinScreen() {
        this.world.bossBar.setPercentage(0);
        this.world.flyingBottles = [];

        const showResult = () => {
            this.world.finishWorld(showWinScreen, 0);
        };

        window.setTimeout(showResult, 520);
    }
}