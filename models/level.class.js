/**
 * Stores all objects that belong to one game level.
 */
class Level {
    enemies;
    clouds;
    backgroundObjects;
    level_end_x = 2200;

    /**
     * Creates a new level setup.
     * @param {Array} enemies Enemy collection.
     * @param {Array} clouds Cloud collection.
     * @param {Array} backgroundObjects Background collection.
     */
    constructor(enemies, clouds, backgroundObjects) {
        this.enemies = enemies;
        this.clouds = clouds;
        this.backgroundObjects = backgroundObjects;
    }
}