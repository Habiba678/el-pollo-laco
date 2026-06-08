/**
 * Creates the first level with enemies, clouds and background objects.
 * @returns {Level} The prepared first level.
 */
function createLevel1() {
    return new Level(
        createEnemyList(),
        createCloudList(),
        createBackgroundList()
    );
}

/**
 * Creates all enemies for the first level.
 * @returns {MovableObject[]} Enemies used in the level.
 */
function createEnemyList() {
    return [
        new ChickenSmall(),
        new Chicken(),
        new ChickenSmall(),
        new Chicken(),
        new ChickenSmall(),
        new Chicken(),
        new Endboss()
    ];
}

/**
 * Creates all clouds for the first level.
 * @returns {Cloud[]} Cloud objects used in the level.
 */
function createCloudList() {
    return [
        new Cloud(200),
        new Cloud(250),
        new Cloud(700),
        new Cloud(1150),
        new Cloud(1600),
        new Cloud(2050),
        new Cloud(2500)
    ];
}

/**
 * Creates all background layer objects.
 * @returns {BackgroundObject[]} Background objects used in the level.
 */
function createBackgroundList() {
    return [
        new BackgroundObject("assets/img/5_background/layers/air.png", -719),
        new BackgroundObject("assets/img/5_background/layers/3_third_layer/2.png", -719),
        new BackgroundObject("assets/img/5_background/layers/2_second_layer/2.png", -719),
        new BackgroundObject("assets/img/5_background/layers/1_first_layer/2.png", -719),

        new BackgroundObject("assets/img/5_background/layers/air.png", 0),
        new BackgroundObject("assets/img/5_background/layers/3_third_layer/1.png", 0),
        new BackgroundObject("assets/img/5_background/layers/2_second_layer/1.png", 0),
        new BackgroundObject("assets/img/5_background/layers/1_first_layer/1.png", 0),

        new BackgroundObject("assets/img/5_background/layers/air.png", 719),
        new BackgroundObject("assets/img/5_background/layers/3_third_layer/2.png", 719),
        new BackgroundObject("assets/img/5_background/layers/2_second_layer/2.png", 719),
        new BackgroundObject("assets/img/5_background/layers/1_first_layer/2.png", 719),

        new BackgroundObject("assets/img/5_background/layers/air.png", 719 * 2),
        new BackgroundObject("assets/img/5_background/layers/3_third_layer/1.png", 719 * 2),
        new BackgroundObject("assets/img/5_background/layers/2_second_layer/1.png", 719 * 2),
        new BackgroundObject("assets/img/5_background/layers/1_first_layer/1.png", 719 * 2),

        new BackgroundObject("assets/img/5_background/layers/air.png", 719 * 3),
        new BackgroundObject("assets/img/5_background/layers/3_third_layer/2.png", 719 * 3),
        new BackgroundObject("assets/img/5_background/layers/2_second_layer/2.png", 719 * 3),
        new BackgroundObject("assets/img/5_background/layers/1_first_layer/2.png", 719 * 3)
    ];
}