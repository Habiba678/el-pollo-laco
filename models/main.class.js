/**
 * Manages canvas images for start and result screens.
 */
class CanvasView {
    canvas = null;
    ctx = null;
    storedCanvasImage = null;

    startImagePath = "./assets/img/9_intro_outro_screens/start/startscreen_1.png";

    /**
     * Creates a helper for drawing screen images on the canvas.
     * @param {HTMLCanvasElement} canvas Canvas element.
     */
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
    }

    /**
     * Shows the start image on the full canvas.
     * @param {Function} [afterDraw] Function that runs after drawing.
     * @returns {void}
     */
    showStart(afterDraw) {
        this.storedCanvasImage = null;
        this.loadImage(this.startImagePath, (image) => {
            this.emptyCanvas();
            this.paintFullCanvas(image);
            this.runCallback(afterDraw);
        });
    }

    /**
     * Shows a result image on top of the current canvas.
     * @param {string} imagePath Result image path.
     * @param {Function} [afterDraw] Function that runs after drawing.
     * @returns {void}
     */
    showResult(imagePath, afterDraw) {
        this.saveCanvasOnce();

        this.loadImage(imagePath, (image) => {
            this.restoreCanvas();
            this.paintCenteredImage(image);
            this.runCallback(afterDraw);
        });
    }

    /**
     * Loads one image and returns it through a callback.
     * @param {string} path Image path.
     * @param {(image: HTMLImageElement) => void} onReady Runs when image is loaded.
     * @returns {void}
     */
    loadImage(path, onReady) {
        const image = new Image();

        image.onload = () => onReady(image);
        image.onerror = () => console.error("Image could not be loaded:", path);
        image.src = path;
    }

    /**
     * Saves the current canvas image only once.
     * @returns {void}
     */
    saveCanvasOnce() {
        if (this.storedCanvasImage) return;

        this.storedCanvasImage = this.ctx.getImageData(
            0,
            0,
            this.canvas.width,
            this.canvas.height
        );
    }

    /**
     * Restores the saved canvas image.
     * @returns {void}
     */
    restoreCanvas() {
        if (!this.storedCanvasImage) return;

        this.ctx.putImageData(this.storedCanvasImage, 0, 0);
    }

    /**
     * Draws an image over the full canvas area.
     * @param {HTMLImageElement} image Loaded image.
     * @returns {void}
     */
    paintFullCanvas(image) {
        this.ctx.drawImage(image, 0, 0, this.canvas.width, this.canvas.height);
    }

    /**
     * Draws an image centered on the canvas.
     * @param {HTMLImageElement} image Loaded image.
     * @returns {void}
     */
    paintCenteredImage(image) {
        const box = this.createCenteredBox(image);
        this.ctx.drawImage(image, box.x, box.y, box.width, box.height);
    }

    /**
     * Calculates a centered drawing box.
     * @param {HTMLImageElement} image Loaded image.
     * @returns {{x:number,y:number,width:number,height:number}} Drawing box.
     */
    createCenteredBox(image) {
        const canvasRatio = this.canvas.width / this.canvas.height;
        const imageRatio = image.width / image.height;

        let width = this.canvas.width * 0.76;
        let height = width / imageRatio;

        if (height > this.canvas.height * 0.76) {
            height = this.canvas.height * 0.76;
            width = height * imageRatio;
        }

        return {
            width,
            height,
            x: (this.canvas.width - width) / 2,
            y: (this.canvas.height - height) / 2
        };
    }

    /**
     * Clears the canvas.
     * @returns {void}
     */
    emptyCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    /**
     * Runs a callback only if it exists.
     * @param {Function} callback Optional callback.
     * @returns {void}
     */
    runCallback(callback) {
        if (typeof callback === "function") {
            callback();
        }
    }
}