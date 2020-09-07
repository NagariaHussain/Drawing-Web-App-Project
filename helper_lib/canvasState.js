// ************
// CanvasState Modal
// ************
class CanvasState {
    // Get the canvas element
    constructor(canvas) {
        this.canvas = canvas;
        loadPixels();
        this.prevState = new Uint8ClampedArray(pixels);
    }

    // Clear the canvas state
    clear() {
        loadPixels();
        this.prevState = new Uint8ClampedArray(pixels)
    }

    // Save the current pixels array
    saveState() {
        this.prevState = new Uint8ClampedArray(pixels);
    }

    // Get saved state
    getPreviousState() {
        return this.prevState;
    }
}