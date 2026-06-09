/**
 * Creates a status bar.
 */
class StatusBar extends DrawableObject {
    value = 100;
    images = [];
    kind = "health";
    reversed = false;

    healthImages = [
        "./assets/img/7_statusbars/1_statusbar/2_statusbar_health/blue/0.png",
        "./assets/img/7_statusbars/1_statusbar/2_statusbar_health/blue/20.png",
        "./assets/img/7_statusbars/1_statusbar/2_statusbar_health/blue/40.png",
        "./assets/img/7_statusbars/1_statusbar/2_statusbar_health/blue/60.png",
        "./assets/img/7_statusbars/1_statusbar/2_statusbar_health/blue/80.png",
        "./assets/img/7_statusbars/1_statusbar/2_statusbar_health/blue/100.png"
    ];

    bottleImages = [
        "./assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/100.png",
        "./assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/80.png",
        "./assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/60.png",
        "./assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/40.png",
        "./assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/20.png",
        "./assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/0.png"
    ];
    
    coinImages = [
        "./assets/img/7_statusbars/1_statusbar/1_statusbar_coin/green/100.png",
        "./assets/img/7_statusbars/1_statusbar/1_statusbar_coin/green/80.png",
        "./assets/img/7_statusbars/1_statusbar/1_statusbar_coin/green/60.png",
        "./assets/img/7_statusbars/1_statusbar/1_statusbar_coin/green/40.png",
        "./assets/img/7_statusbars/1_statusbar/1_statusbar_coin/green/20.png",
        "./assets/img/7_statusbars/1_statusbar/1_statusbar_coin/green/0.png"
    ];

    bossImages = [
        "./assets/img/7_statusbars/2_statusbar_endboss/orange/orange0.png",
        "./assets/img/7_statusbars/2_statusbar_endboss/orange/orange20.png",
        "./assets/img/7_statusbars/2_statusbar_endboss/orange/orange40.png",
        "./assets/img/7_statusbars/2_statusbar_endboss/orange/orange60.png",
        "./assets/img/7_statusbars/2_statusbar_endboss/orange/orange80.png",
        "./assets/img/7_statusbars/2_statusbar_endboss/orange/orange100.png"
    ];

    /**
     * Creates one status display.
     * @param {string} kind Display type.
     * @param {number} x Horizontal position.
     * @param {number} y Vertical position.
     */
    constructor(kind = "health", x = 30, y = 0) {
        super();
        this.x = x;
        this.y = y;
        this.width = 200;
        this.height = 60;
        this.prepareBar(kind);
    }

    /**
     * Selects images and start value.
     * @param {string} kind Display type.
     * @returns {void}
     */
    prepareBar(kind) {
        this.kind = kind;

        if (kind === "bottle") {
            this.useImages(this.bottleImages, 0, true);
            return;
        }

        if (kind === "coins") {
            this.useImages(this.coinImages, 0, true);
            return;
        }

        if (kind === "boss") {
            this.useImages(this.bossImages, 100, false);
            return;
        }

        this.useImages(this.healthImages, 100, false);
    }

    /**
     * Loads images and applies the first value.
     * @param {string[]} imageSet Images for this bar.
     * @param {number} startValue Start percentage.
     * @param {boolean} reverse True for reverse image order.
     * @returns {void}
     */
    useImages(imageSet, startValue, reverse) {
        this.images = imageSet;
        this.reversed = reverse;
        this.loadImages(this.images);
        this.setBarValue(startValue);
    }

    /**
     * Updates health or boss bars.
     * @param {number} value Current percentage.
     * @returns {void}
     */
    setPercentage(value) {
        this.setBarValue(value);
    }

    /**
     * Updates bottle or coin bars.
     * @param {number} value Current percentage.
     * @returns {void}
     */
    setBottlePercentage(value) {
        this.setBarValue(value);
    }

    /**
     * Saves value and refreshes image.
     * @param {number} value Current percentage.
     * @returns {void}
     */
    setBarValue(value) {
        this.value = value;
        this.img = this.imageCache[this.images[this.findImageIndex()]];
    }

    /**
     * Finds the correct image index.
     * @returns {number} Image index.
     */
    findImageIndex() {
        const normalIndex = this.findNormalIndex();

        if (!this.reversed) {
            return normalIndex;
        }

        return 5 - normalIndex;
    }

    /**
     * Converts percentage into a normal image index.
     * @returns {number} Image index.
     */
    findNormalIndex() {
        if (this.value < 20) return 0;
        if (this.value < 40) return 1;
        if (this.value < 60) return 2;
        if (this.value < 80) return 3;
        if (this.value < 100) return 4;

        return 5;
    }
}