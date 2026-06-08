/**
 * Handles canvas screens like start and result images.
 */
class CanvasView {
    canvas = null;
    ctx = null;
    savedFrame = null;

    /**
     * Connects the canvas with this view helper.
     * @param {HTMLCanvasElement} canvas The game canvas.
     */
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
    }

    /**
     * Draws the start screen image.
     * @param {Function} [callback] Optional callback after drawing.
     */
    showStart(callback) {
        this.savedFrame = null;
        this.drawFullImage(
            "./assets/img/9_intro_outro_screens/start/startscreen_1.png",
            callback
        );
    }

    /**
     * Draws a result image centered on the canvas.
     * @param {string} imagePath Path to the result image.
     * @param {Function} [callback] Optional callback after drawing.
     */
    showResult(imagePath, callback) {
        if (!this.savedFrame) {
            this.savedFrame = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        }

        const image = new Image();
        image.src = imagePath;

        image.onload = () => {
            const size = this.getCenteredSize(image);

            this.ctx.putImageData(this.savedFrame, 0, 0);
            this.ctx.drawImage(image, size.x, size.y, size.width, size.height);

            if (typeof callback === "function") callback();
        };
    }

    /**
     * Draws one image across the whole canvas.
     * @param {string} imagePath Image path.
     * @param {Function} [callback] Optional callback after drawing.
     */
    drawFullImage(imagePath, callback) {
        const image = new Image();
        image.src = imagePath;

        image.onload = () => {
            this.clear();
            this.ctx.drawImage(image, 0, 0, this.canvas.width, this.canvas.height);

            if (typeof callback === "function") callback();
        };
    }

    /**
     * Calculates centered image dimensions.
     * @param {HTMLImageElement} image Image element.
     * @returns {{x:number,y:number,width:number,height:number}} Position and size.
     */
    getCenteredSize(image) {
        const ratio = Math.min(
            (this.canvas.width * 0.78) / image.width,
            (this.canvas.height * 0.78) / image.height
        );

        const width = image.width * ratio;
        const height = image.height * ratio;

        return {
            width,
            height,
            x: (this.canvas.width - width) / 2,
            y: (this.canvas.height - height) / 2
        };
    }

    /**
     * Clears the canvas.
     */
    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}