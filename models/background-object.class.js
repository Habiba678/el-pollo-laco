class BackgroundObject extends MovableObject {
    width = 720;
    height = 480;
    distance = 1;

    /**
     * Creates one background layer.
     * @param {string} imagePath Path to the background image.
     * @param {number} x Horizontal position.
     * @param {number} distance Parallax movement factor.
     */
    constructor(imagePath, x, distance = 1) {
        super();
        this.loadImage(imagePath);
        this.x = x;
        this.y = 0;
        this.distance = distance;
    }
}