/* -------- 
CONSTRUCTOR FUNCTION FOR ERASOR TOOL
--------- */

function EraserTool() {
    // Public variables and Constants
    const MIN_ERASER_SIZE = 2;
    const MAX_ERASER_SIZE = 70;

    this.name = 'EraserTool';
    this.icon = 'assets/icons/eraser.png';
    this.mouseIconUrl = 'assets/icons/eraser.png';

    // Private variables
    let eraserSize = 10;
    let eraserSizeSilder;
    let currentWeightText;
    let sliderDesc;

    var previousMouseX = -1;
    var previousMouseY = -1;


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
                push();
                noFill();
                stroke(255);
                strokeWeight(eraserSize);
                line(previousMouseX, previousMouseY, mouseX, mouseY);
                previousMouseX = mouseX;
                previousMouseY = mouseY;
                pop();
            }
        }
        //if the user has released the mouse we want to set the previousMouse values 
        //back to -1.
        else {
            previousMouseX = -1;
            previousMouseY = -1;
        }

        // Check weather updating keys are down 
        checkEraserSizeUpdate();
    };

    // Populate the options in .options area
    this.populateOptions = function () {
        const menuSpace = select(".options");

        // Slider description text
        sliderDesc = createP("Erasor Size: ");
        sliderDesc.style("display", "inline-block");

        // Display current erasor weight
        currentWeightText = createP(`${eraserSize.toFixed(1)}`);
        currentWeightText.style("display", "inline-block");

        // HTML Slider element
        eraserSizeSilder = createSlider(MIN_ERASER_SIZE, MAX_ERASER_SIZE, eraserSize, 0.10);
        eraserSizeSilder.style("margin", "0 20px");

        // Appending the options to options area
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

    // Clear the options area
    this.unselectTool = function () {
        select(".options").html("");
    };

    // PRIVATE METHODS
    // Changing size using keyboard shortcut
    function checkEraserSizeUpdate() {
        if (keyIsDown(107) || keyIsDown(187)) {
            updateEraserSize('INCREASE');
        } else if (keyIsDown(109) || keyIsDown(189)) {
            updateEraserSize('DECREASE');
        }
    }

    // Updating the size variable according to updatetype
    function updateEraserSize(updateType) {
        if (updateType === 'INCREASE') {
            eraserSize = (eraserSize >= MAX_ERASER_SIZE) ? eraserSize : eraserSize + 1;
        }
        else if (updateType === 'DECREASE') {
            eraserSize = (eraserSize <= MIN_ERASER_SIZE) ? eraserSize : eraserSize - 1;
        }
        else {
            // Reset to default
            eraserSize = 10;
        }

        // Update slider value
        eraserSizeSilder.value(eraserSize);

        // Update value display
        currentWeightText.html(`${eraserSize.toFixed(1)}`);
    }
}
