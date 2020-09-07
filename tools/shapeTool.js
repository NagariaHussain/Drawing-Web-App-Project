/* -------- 
CONSTRUCTOR FUNCTION FOR SHAPE TOOL
--------- */

function ShapeTool() {
    // Public properties
    this.name = "ShapeTool";
    this.icon = "assets/icons/shapes.png";

    // Constants
    const UP_ARROW_CODE = 38;
    const DOWN_ARROW_CODE = 40;

    // Variables
    let isUserDrawing;
    let startMouseX;
    let startMouseY;
    let shapes;
    let selectedShape;
    let shapeSelecter;
    let switchFill;
    let currentShape;

    // Number of sides of Polygon
    let numOfSides = 5;

    function initTool() {
        resetState();
        shapes = ['ellipse', 'rectangle', 'circle', 'polygon', 'star'];
        selectedShape = 'rectangle';
    }

    function resetState() {
        isUserDrawing = false;
        startMouseX = -1;
        startMouseY = -1;
    }

    function shapeChanged() {
        selectedShape = shapeSelecter.value();
    }

    function drawShape() {
        if (mouseIsPressed) {
            if (startMouseX === -1) {
                // Start drawing
                startMouseX = mouseX;
                startMouseY = mouseY;
                isUserDrawing = true;
                numOfSides = 5;

                // Save current canvas state
                loadPixels();
            }
            else {
                updatePixels();
                // Draw based on selected shape
                switch (selectedShape) {
                    case 'rectangle': {
                        if (keyIsPressed && keyCode === 16) {
                            // Draw square if shift key is pressed
                            // Finding the side of square
                            currentShape = Rectangle.Square(startMouseX, startMouseY, mouseX, mouseY);
                        } else {
                            // Otherwise draw rectangle
                            currentShape = Rectangle.fromCoordinatePairs(startMouseX, startMouseY, mouseX, mouseY);
                        }
                        break;
                    }
                    case 'ellipse': {
                        currentShape = Ellipse.fromCoordinatePairs(startMouseX, startMouseY, mouseX, mouseY);
                        break;
                    }
                    case 'circle': {
                        currentShape = Circle.fromCoordinatePairs(startMouseX, startMouseY, mouseX, mouseY);
                        break;
                    }
                    case 'polygon': {
                        currentShape = RegularPolygon.fromCoordinatePairs(startMouseX, startMouseY, mouseX, numOfSides);
                        break;
                    }
                    case 'star': {
                        currentShape = Star.fromCoordinatePairs(startMouseX, startMouseY, mouseX, numOfSides);
                        break;
                    }
                    default:
                        break;
                }
                // Drawing the current shape
                currentShape.draw();
            }
        }
        else if (isUserDrawing) {
            // User has completed drawing, reset the tool state
            loadPixels();
            resetState();
        }
    }

    this.keyPressed = function () {
        if (keyCode === UP_ARROW_CODE) {
            numOfSides++;
        }
        else if (keyCode === DOWN_ARROW_CODE) {
            if (numOfSides > 3) {
                numOfSides--;
            }
        }

        if (key === 'F' || key === 'f') {
            // Toggling Fill
            switchFill.checked(!switchFill.checked());
        }
    }

    this.draw = function () {
        push();
        if (!switchFill.checked()) {
            noFill();
        }

        drawShape();
        pop();
    }

    this.populateOptions = function () {
        let menuSpace = select(".options");

        // Button to toggle fill of shapes
        switchFill = createCheckbox('Is filled', true);
        switchFill.parent(menuSpace);

        // Shape select menu
        shapeSelecter = createSelect();
        shapeSelecter.parent(menuSpace);
        for (shape of shapes) {
            shapeSelecter.option(shape);
        }

        shapeSelecter.changed(shapeChanged);
        shapeSelecter.selected('rectangle');


    }

    this.unselectTool = function () {
        select(".options").html("");
    }

    initTool();
}