/* -------- 
CONSTRUCTOR FUNCTION FOR ERASOR TOOL
Use: Let's the user erase portions of drawing
--------- */

function EraserTool() {
    // Public variables and Constants
    // Unique name for this tool
    this.name = 'EraserTool';

    // Path to the eraser icon image file
    this.icon = 'assets/icons/eraser.png';
    this.mouseIconUrl = 'assets/icons/eraser.png';

    // Private variables
    let eraserSize = 10;
    let eraserSizeSilder;
    let currentWeightText;
    let sliderDesc;

    var previousMouseX = -1;
    var previousMouseY = -1;

    // Private constants
    const MIN_ERASER_SIZE = 2;
    const MAX_ERASER_SIZE = 70;

    // PUBLIC METHODS
    this.draw = function () {
        //if the mouse is pressed
        if (mouseIsPressed) {
            //check if they previousX and Y are -1. set them to the current
            //mouse X and Y if they are.
            if (previousMouseX == -1) {
                previousMouseX = mouseX;
                previousMouseY = mouseY;
            }
            //if we already have values for previousX and Y we can draw a line from 
            //there to the current mouse location
            else {
                // Push new state
                push();
                // Remove fill color
                noFill();
                // Set stroke to white
                stroke(255);
                // Set stroke weight to the eraser size
                strokeWeight(eraserSize);
                // Draw a line between prev and current mouse location
                line(previousMouseX, previousMouseY, mouseX, mouseY);

                // Update the prev mouse location coordinates
                previousMouseX = mouseX;
                previousMouseY = mouseY;

                // Pop off the current state
                pop();
            }
        }
        //if the user has released the mouse we want to set the previousMouse values 
        //back to -1.
        else {
            previousMouseX = -1;
            previousMouseY = -1;
        }

        // Check wheater updating keys are down 
        checkEraserSizeUpdate();
    };

    // Populate the options in .options area
    this.populateOptions = function () {
        // Get the options area
        const menuSpace = select(".options");

        // Create description text
        sliderDesc = createP("Erasor Size: ");
        // Add styling
        sliderDesc.style("display", "inline-block");

        // Display current erasor weight
        currentWeightText = createP(`${eraserSize.toFixed(1)}`);
        currentWeightText.style("display", "inline-block");

        // Create slider DOM element
        // will be used to control eraser size
        eraserSizeSilder = createSlider(
            MIN_ERASER_SIZE,
            MAX_ERASER_SIZE,
            eraserSize,
            0.10
        );

        // Add a 20px margin to left and right 
        eraserSizeSilder.style("margin", "0 20px");

        // Appending the options to 
        // options area as children
        menuSpace.child(sliderDesc);
        menuSpace.child(eraserSizeSilder);
        menuSpace.child(currentWeightText);

        // Listening to eraser size change event
        eraserSizeSilder.input((e) => {
            // Update the eraser size
            eraserSize = Number(e.target.value);

            // Update the size display
            currentWeightText.html(`${eraserSize.toFixed(1)}`);
        });

        // Updating status bar text
        statusBar.setTempText("You can press +/- keys to increase/decrease eraser size", 6000);

        // Set mouse icon
        mouseIconController.setIcon(this.mouseIconUrl);
    };

    // Called when another tool is selected 
    this.unselectTool = function () {
        // Clear the options area
        select(".options").html("");
    };

    // PRIVATE METHODS
    // Changing size using keyboard shortcut
    function checkEraserSizeUpdate() {
        // If '+' key is pressed
        if (keyIsDown(107) || keyIsDown(187)) {
            // Increase the eraser size
            updateEraserSize('INCREASE');
        } 
        // If '-' key is pressed
        else if (keyIsDown(109) || keyIsDown(189)) {
            // Decrease the eraser size
            updateEraserSize('DECREASE');
        }
    }

    // Updating the size variable according to updatetype
    function updateEraserSize(updateType) {
        // If updateType is increase of size
        if (updateType === 'INCREASE') {
            // Increase the size by 1
            // only if the eraser's size is less 
            // than the Max size allowed
            eraserSize = (eraserSize >= MAX_ERASER_SIZE) ? eraserSize : eraserSize + 1;
        }

        // If the updateType is decrease of size
        else if (updateType === 'DECREASE') {
            // Decrease the size by 1
            // only if the eraser's size is greater
            // than the Min size allowed
            eraserSize = (eraserSize <= MIN_ERASER_SIZE) ? eraserSize : eraserSize - 1;
        }

        // Otherwise
        else {
            // Reset to default
            eraserSize = 10;
        }

        // Update eraser size slider value
        eraserSizeSilder.value(eraserSize);

        // Update value display text
        currentWeightText.html(`${eraserSize.toFixed(1)}`);
    }
}
