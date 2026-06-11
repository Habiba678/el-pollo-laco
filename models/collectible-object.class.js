/**
 * Represents a collectible item in the level.
 */
class CollectibleObject extends MovableObject {
    type = "bottle";

    coinImages = [
        "./assets/img/8_coin/coin_1.png",
        "./assets/img/8_coin/coin_2.png"
    ];

    /**
     * Creates a collectible item.
     * @param {number} x Horizontal position.
     * @param {number} y Vertical position.
     * @param {"bottle"|"coin"} type Item type.
     */
    constructor(x, y, type = "bottle") {
        super();
        this.x = x;
        this.y = y;
        this.type = type;
        this.setupItem();
    }

    /**
     * Selects image, size and hitbox for the item type.
     */
    setupItem() {
        if (this.type === "coin") {
            this.setupCoin();
            return;
        }

        this.setupBottle();
    }

    /**
     * Sets up a collectible bottle.
     */
    setupBottle() {
        this.loadImage("./assets/img/6_salsa_bottle/2_salsa_bottle_on_ground.png");
        this.width = 70;
        this.height = 80;
        this.offset = { top: 8, bottom: 5, left: 8, right: 8 };
    }

    /**
     * Sets up a collectible coin.
     */
    setupCoin() {
        this.loadImage(this.coinImages[0]);
        this.loadImages(this.coinImages);
        this.width = 95;
        this.height = 95;
        this.offset = { top: 35, bottom: 35, left: 35, right: 35 };
        this.animateCoin();
    }

    /**
     * Animates the coin.
     */
    animateCoin() {
        setInterval(() => {
            this.playAnimation(this.coinImages);
        }, 300);
    }
}