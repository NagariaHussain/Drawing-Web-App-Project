/* -------- 
CONSTRUCTOR FUNCTION FOR SHAPE TOOL
Use: Let's the user draw a variety 
of either filled or unfilled regular shapes.
--------- */

// NOTE:
// The shape objects used in this file can 
// be found in the: helper_lib/custom_objects/shapes.js file

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
    // Set initially to draw a pentagon
    let numOfSides = 5;

    // Function to initialize the tool state
    function initTool() {
        // Reset the state
        resetState();

        // Create an array of shape choices
        shapes = ['ellipse', 'rectangle', 'circle', 'polygon', 'star'];

        // Set the initial shape to rectangle
        selectedShape = 'rectangle';
    }

    // Function to reset tool state
    function resetState() {
        // Set the user drawing to false
        isUserDrawing = false;

        // Reset the starting coordinates to -1
        startMouseX = -1;
        startMouseY = -1;
    }

    // Function to handle shape change event
    function shapeChanged() {
        // Update the selected shape
        selectedShape = shapeSelecter.value();
    }

    // Function to draw the shape
    function drawShape() {
        // If mouse if currently pressed
        if (mouseIsPressed) {
            // If the user has not yet started drawing
            if (startMouseX === -1) {
                // Start drawing
                startMouseX = mouseX;
                startMouseY = mouseY;
                isUserDrawing = true;

                // Set number of sides of polygon back to 4
                numOfSides = 5;

                // Save current canvas state
                loadPixels();
            }
            // If mouse is not pressed
            else {
                // Update the canvas to 
                // match the pixels array
                updatePixels();

                // Draw based on selected shape
                switch (selectedShape) {
                    // When the rectangle shape is selected
                    case 'rectangle':
                        {
                            if (keyIsPressed && keyCode === 16) {
                                // Set current shape to square if 
                                // shift key is pressed using the 
                                // static `Square` method 
                                // of the Rectangle class
                                currentShape = Rectangle.Square(
                                    startMouseX,
                                    startMouseY,
                                    mouseX,
                                    mouseY
                                );

                            }
                            // If shift is not pressed
                            else {
                                // Otherwise draw rectangle
                                currentShape = Rectangle.fromCoordinatePairs(
                                    startMouseX,
                                    startMouseY,
                                    mouseX,
                                    mouseY
                                );
                            }

                            // Exit from the switch block
                            break;
                        }

                    // When ellipse if selected
                    case 'ellipse':
                        {
                            // Set current shape to an 
                            // instance of ellipse object
                            currentShape = Ellipse.fromCoordinatePairs(
                                startMouseX,
                                startMouseY,
                                mouseX,
                                mouseY
                            );
                            // Exit from the switch block
                            break;
                        }

                    // When circle is selected
                    case 'circle':
                        {
                            // Set current shape to an
                            // instance of circle object
                            currentShape = Circle.fromCoordinatePairs(
                                startMouseX,
                                startMouseY,
                                mouseX,
                                mouseY
                            );
                            // Exit from the switch block
                            break;
                        }

                    // When polygon is selected
                    case 'polygon':
                        {
                            // Set current shape to an 
                            // instance of regular polygon object
                            currentShape = RegularPolygon.fromCoordinatePairs(startMouseX, startMouseY, mouseX, numOfSides);

                            // Exit from the switch block
                            break;
                        }

                    // When star shape is selected
                    case 'star':
                        {
                            // Set current shape to an 
                            // instance of Star object
                            currentShape = Star.fromCoordinatePairs(startMouseX, startMouseY, mouseX, numOfSides);

                            // Exit from the switch block
                            break;
                        }
                    default:
                        break;
                }

                // Drawing the current shape
                // by calling the draw() method  
                // of the current shape object
                // If fill option is NOT checked
                currentShape.draw();
            }
        }

        // If user is drawing 
        // and mouse is not pressed
        else if (isUserDrawing) {
            // User has completed drawing, reset the tool state
            // Load the data to the pixels array
            loadPixels();

            // Reset to default state
            resetState();
        }
    }

    // Method called on the event of a key Press
    this.keyPressed = function () {
        // If up arrow key is pressed
        if (keyCode === UP_ARROW_CODE) {
            // Increase the number of sides
            numOfSides++;
        }

        // If down arrow key is pressed
        else if (keyCode === DOWN_ARROW_CODE) {
            // If the number of sides is greated than 3
            if (numOfSides > 3) {
                // Decrease the number of 
                // sides of the polygon
                numOfSides--;
            }
        }

        // Shortcut to toggle the fill property
        // If the 'F'/'f' key is pressed
        if (key === 'F' || key === 'f') {
            // Toggle the filled property
            switchFill.checked(!switchFill.checked());
        }
    }

    // Draw method, to be called by the 
    // main draw() function
    this.draw = function () {
        // Push a new state
        push();

        // If fill option is NOT checked
        if (!switchFill.checked()) {
            // Remove any fill color
            noFill();
        } else {
            fill(fillColor);
        }

        // Draw the shape to the canvas
        drawShape();

        // Pop off the current state
        pop();
    }

    // Method to be called to populate options 
    // and controls related with this tool
    this.populateOptions = function () {

        // Select the menu space area
        let menuSpace = select(".options");

        // Create a checkbox to handle fill/no fill
        switchFill = createCheckbox('Is filled', true);

        // Make the checkbox, child of the menuSpace
        switchFill.parent(menuSpace);

        // Create a shape slector select DOM element
        shapeSelecter = createSelect();

        // Make the select element, a child 
        // of the menuSpace DOM element
        shapeSelecter.parent(menuSpace);

        // Populate the select element with the 
        // available shape options
        for (let shape of shapes) {
            shapeSelecter.option(shape);
        }

        // Attach change event listener
        shapeSelecter.changed(shapeChanged);

        // Set the select's value to the 
        // currently selected shape option
        shapeSelecter.selected(selectedShape);
    }

    // Method to be called when 
    // some other tool gets selected
    this.unselectTool = function () {
        // Clear the options area
        select(".options").html("");
    }

    // Initialize the tool on first 
    // creation of this tool's object
    initTool();
}