class DrawableObject {
    img;
    imageCache = {};
    currentImage = 0;
    x = 120;
    y = 280;
    height = 150;
    width = 100;

    /**
     * Loads one image for this object.
     * @param {string} path Path to the image file.
     */
    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }

    /**
     * Draws the object image on the canvas.
     * @param {CanvasRenderingContext2D} ctx Canvas rendering context.
     */
    draw(ctx) {
        if (!this.img) {
            console.log("No image available:", this);
            return;
        }
    
        if (!this.img.complete) {
            console.log("Image is still loading:", this.img.src);
            return;
        }
    
        if (this.img.naturalWidth === 0) {
            console.log("Broken image path:", this.img.src, this);
            return;
        }
    
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }

    /**
     * Preloads several images and stores them in the image cache.
     * @param {string[]} paths Image paths for animation frames.
     */
    loadImages(paths) {
        paths.forEach((path) => {
            const image = new Image();
            image.src = path;
            this.imageCache[path] = image;
        });
    }
}