class StatusBar extends DrawableObject {
    value = 100;
    images = [];

    healthImages = [
        "./assets/img/7_statusbars/1_statusbar/2_statusbar_health/blue/0.png",
        "./assets/img/7_statusbars/1_statusbar/2_statusbar_health/blue/20.png",
        "./assets/img/7_statusbars/1_statusbar/2_statusbar_health/blue/40.png",
        "./assets/img/7_statusbars/1_statusbar/2_statusbar_health/blue/60.png",
        "./assets/img/7_statusbars/1_statusbar/2_statusbar_health/blue/80.png",
        "./assets/img/7_statusbars/1_statusbar/2_statusbar_health/blue/100.png"
    ];

    /**
     * Creates the health status bar.
     */
    constructor() {
        super();
        this.x = 30;
        this.y = 0;
        this.width = 200;
        this.height = 60;
        this.images = this.healthImages;
        this.loadImages(this.images);
        this.setPercentage(100);
    }

    /**
     * Updates the status bar value.
     * @param {number} value Current percentage.
     */
    setPercentage(value) {
        this.value = value;
        this.img = this.imageCache[this.images[this.getImageIndex()]];
    }

    /**
     * Selects the matching image.
     * @returns {number} Image index.
     */
    getImageIndex() {
        if (this.value >= 100) return 5;
        if (this.value >= 80) return 4;
        if (this.value >= 60) return 3;
        if (this.value >= 40) return 2;
        if (this.value >= 20) return 1;
        return 0;
    }
}