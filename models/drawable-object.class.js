/**
 * Base class for drawable objects.
 */
class DrawableObject {
    img;
    imageCache = {};
    currentImage = 0;
    x = 120;
    y = 280;
    height = 150;
    width = 100;

    /**
     * Loads one image.
     * @param {string} path Image path.
     * @returns {void}
     */
    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }

    /**
     * Draws the image.
     * @param {CanvasRenderingContext2D} ctx Canvas context.
     * @returns {void}
     */
    draw(ctx) {
        if (!this.img || !this.img.complete || this.img.naturalWidth === 0) {
            return;
        }

        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }

    /**
     * Loads multiple images.
     * @param {string[]} paths Image paths.
     * @returns {void}
     */
    loadImages(paths) {
        paths.forEach((path) => {
            const image = new Image();
            image.src = path;
            this.imageCache[path] = image;
        });
    }
}