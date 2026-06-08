
/**
 * Represents a cloud moving through the level.
 */
class Cloud extends MovableObject {
    y = 20;
    width = 500;
    height = 250;
    speed = 0.15;

    constructor(x = 50 + Math.random() * 1000) {
        super();
        this.loadImage("./assets/img/5_background/layers/4_clouds/1.png");
        this.x = x;
        this.animate();
    }

    /**
     * Moves the cloud continuously to the left.
     */
    animate() {
        setInterval(() => {
            this.moveLeft();
        }, 1000 / 80);
    }
}