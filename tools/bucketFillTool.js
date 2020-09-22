/* -------- 
CONSTRUCTOR FUNCTION FOR BUCKET FILL TOOL
Use: Used to fill an enclosed area on canvas

Note:
The FloodFill class used in this file is 
defined in: helper_lib/floood.js file.
--------- */

function BucketFillTool() {
    // Public Properties
    // Unique Icon Name
    this.name = "BucketFillTool";

    // Path to tool icon image file
    this.icon = "assets/icons/bucket.png";
    this.mouseIconUrl = "assets/icons/bucket.png";

    // Handle deligated mouse press event
    this.mousePressed = function () {
        // If mouse is inside the canvas
        if (mouseInsideCanvas(canvas)) {

            // Get the current mouseX and mouseY
            // Floor to get an integer
            let fmx = Math.floor(mouseX);
            let fmy = Math.floor(mouseY);

            // Getting Data From canvas element
            const context = canvas.elt.getContext('2d');

            // Get pixel data from the canvas context
            const imgData = context.getImageData(0, 0, canvas.elt.width, canvas.elt.height);

            // Construct flood fill instance
            floodFill = new FloodFill(imgData);

            // Call the fill method to carry 
            // out the flood fill algorithm
            floodFill.fill(color(fillColor).toString(), fmx, fmy, 0);

            // Put the modified data back in context
            // floodFill object's imageData property 
            // holds the pixel data
            context.putImageData(floodFill.imageData, 0, 0);

            // Update the status bar text
            statusBar.setTempText("Fill complete.", 5000);
        }
    };

    // Used to set the mouse cursor icon
    this.populateOptions = function () {
        // Set the mouse icon
        mouseIconController.setIcon(this.mouseIconUrl);
    };
}
