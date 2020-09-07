/* -------- 
CONSTRUCTOR FUNCTION FOR BUCKET FILL TOOL
--------- */

function BucketFillTool() {
    // Public Properties
    this.name = "BucketFillTool";
    this.icon = "assets/icons/bucket.png";
    this.mouseIconUrl = "assets/icons/bucket.png";

    // Handle deligated mouse press event
    this.mousePressed = function () {
        if (mouseInsideCanvas(canvas)) {
            let fmx = Math.floor(mouseX);
            let fmy = Math.floor(mouseY);

            // Getting Data From canvas element
            const context = canvas.elt.getContext('2d');
            const imgData = context.getImageData(0, 0, canvas.elt.width, canvas.elt.height);

            // Construct flood fill instance
            floodFill = new FloodFill(imgData);

            floodFill.fill(color(fillColor).toString(), fmx, fmy, 0);

            // Put the modified data back in context
            context.putImageData(floodFill.imageData, 0, 0);
        }
    };

    // Populate options div
    this.populateOptions = function () {
        // Set the mouse icon
        mouseIconController.setIcon(this.mouseIconUrl);
    };
}
