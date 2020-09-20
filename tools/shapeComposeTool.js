/* -------- 
CONSTRUCTOR FUNCTION FOR SHAPE COMPOSITION TOOL
--------- */

function ShapeComposeTool() {
    // Public properties
    this.name = "ShapeComposeTool";
    this.icon = "assets/icons/shape-compose-icon.png";

    // Private Constants
    const UP_ARROW_CODE = 38;
    const DOWN_ARROW_CODE = 40;

    // Private Variables
    let shapes = [];
    let isUserDrawing;
    let startMouseX;
    let startMouseY;
    let selectedShape;
    let shapeSelecter;
    let switchFill;
    let currentShape;
    let finishButton;
    let operationSelector;

    // Types of Boolean operations available
    const operationOptions = [
        'UNION',
        'INTERSECTION',
        'XOR',
        'DIFFERENCE'
    ];

    // No shapes on screen initially
    let onScreenShapes = [];

    // Initialize tool state
    function initTool() {
        resetState();
        shapes = ['rectangle', 'circle', 'polygon', 'ellipse', 'star'];
        selectedShape = 'rectangle';
    }

    // Reset tool to default state
    function resetState() {
        isUserDrawing = false;
        startMouseX = -1;
        startMouseY = -1;
    }

    // Handle shape select option change
    function shapeChanged() {
        selectedShape = shapeSelecter.value();
    }

    // Draw current shape to the canvas
    function drawShape() {
        if (mouseIsPressed && mouseInsideCanvas(canvas)) {
            if (startMouseX === -1) {
                // Start drawing
                startMouseX = mouseX;
                startMouseY = mouseY;
                isUserDrawing = true;
                numOfSides = 5;
            }
            else {
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
                currentShape.draw();
            }
        }
    }

    // Genarate Polygon based on selected operation
    function performOperation() {
        // If there are less then 2 polygons for performing operation
        if (onScreenShapes.length < 2) {
            // Alert the user
            alert("Draw atleast 2 shapes to perform boolean operations");
            // Return without performing any operation
            return;
        }

        // Load the canvas state to pixels array
        loadPixels();

        // Get the previously saved canvas state
        let prevCanvasState = canvasState.getPreviousState();

        // Update the pixels array to match the previous state
        for (let i = 0; i < pixels.length; i++) {
            pixels[i] = prevCanvasState[i];
        }

        // Update the canvas to match the 
        // updated pixels array
        updatePixels();

        // Load the new data to the pixels array
        loadPixels();

        // Converting shapes array into array of vertices array
        // Performing boolean operations requires polygons 
        // to be in GeoJSON format
        const onScreenShapeVertices = onScreenShapes.map(
            (shape) => shape.getVertices()
        );

        // Generating the polygon
        let generatedPolygon;
        // To store the function that will 
        // perform the selected operation
        let operationFunction;

        // Polygon generation based on value of selector
        switch (operationSelector.value()) {
            // If UNION operation is selected
            case "UNION": {
                // Update status bar text
                statusBar.setText("Performing union..");

                // Set operation function to union
                operationFunction = union;
                break;
            }
            // If INTERSECTION operation is selected
            case "INTERSECTION": {
                // Update status bar text
                statusBar.setText("Performing intersection..");

                // Set operation function to intersection
                operationFunction = intersection$1;
                break;
            }
            // If the XOR operation is selected
            case "XOR": {
                // Update status bar text
                statusBar.setText("Performing XOR..");

                // Set the operation function to xor
                operationFunction = xor;
                break;
            }
            // 
            case "DIFFERENCE": {
                // Update status bar text
                statusBar.setText("Performing difference..");

                // Set the operation function to difference
                operationFunction = difference;
                break;
            }
        }

        // Perform the operation on the shapes
        generatedPolygon = operationFunction(...onScreenShapeVertices);

        // Drawing the generated polygon
        // Push new state
        push();

        // Switch fill based on checkbox's value
        if (!switchFill.checked()) {
            noFill();
        } else {
            fill(fillColor);
        }

        // Draw the generated polygon(s)
        for (let i = 0; i < generatedPolygon.length; i++) {
            beginShape();
            for (let v of generatedPolygon[i][0]) {
                vertex(v[0], v[1]);
            }
            endShape(CLOSE);
        }

        // Pop off the current state
        pop();

        // Load the current canvas state 
        // in the pixels array
        loadPixels();

        // Save this state using the canvasState object
        canvasState.saveState();

        // Clear the on screen shapes buffer
        onScreenShapes = [];

        // Update status bar text
        statusBar.setTempText('Composed Polgygon Created.', 4000);
    }

    // Handle mouse release event
    this.mouseReleased = function () {
        // If the use is drawing and 
        // mouse is inside the canvas
        if (isUserDrawing && mouseInsideCanvas(canvas)) {
            // If the shape to be drawn is valid
            if (currentShape.isValid()) {
                // Load the state to the pixels array
                loadPixels();

                // Push the current shape to the on screen 
                // shape's buffer array
                onScreenShapes.push(currentShape);

                // Reset tool state
                resetState();
            } 

            // Update status bar text
            // showing the number of shapes 
            // selected for combination
            statusBar.setTempText(`${onScreenShapes.length} shapes for combination.`, 5000);
        }
    }

    // Called by the p5 draw function
    this.draw = function () {
        // Push new state
        push();
        // Toggle fill based on checkbox's value
        if (!switchFill.checked()) {
            noFill();
        }
        // Draw the shape(s) to the canvas
        drawShape();
        // Pop off the current state
        pop();
    }

    // Handle tool context options creation
    this.populateOptions = function () {
        // Load the state to pixels array
        loadPixels();

        // Save the canvas state
        canvasState.saveState();

        // Select the options space
        let menuSpace = select(".options");

        // Create a checkbox to control fill of shapes
        switchFill = createCheckbox('Is filled', false);

        // Append to menu space as child
        switchFill.parent(menuSpace);

        // Shape select menu
        shapeSelecter = createSelect();

        // Append to menu space as child
        shapeSelecter.parent(menuSpace);

        // Populate with available shapes
        for (let shape of shapes) {
            shapeSelecter.option(shape);
        }

        // Add shape changed event listener 
        // and pass shapeChanged function as callback
        shapeSelecter.changed(shapeChanged);

        // Initially, select the rectangle shape
        shapeSelecter.selected('rectangle');

        // Create a select menu
        // Operation select menu
        operationSelector = createSelect();

        // Add it to DOM as a child of menu Space
        operationSelector.parent(menuSpace);

        // Populate the operation's select menu
        for (let o of operationOptions) {
            operationSelector.option(o);
        }

        // Create a finish button
        finishButton = document.createElement('button');
        // Update button text
        finishButton.innerText = 'Perform';
        // Attach event listener
        finishButton.addEventListener('click', performOperation);

        document.getElementsByClassName("options")[0].appendChild(finishButton);
    }

    // Handle key press events 
    this.keyPressed = function () {
        // If up arrow is pressed
        if (keyCode === UP_ARROW_CODE) {
            // Increase the number of sides
            numOfSides++;
        }
        // If down arrow is pressed
        else if (keyCode === DOWN_ARROW_CODE) {
            // Decrease the number of sides of the polygon
            // only when it it greater than 3
            if (numOfSides > 3) {
                numOfSides--;
            }
        }

        // If the 'F'/'f' key is pressed
        if (key === 'F' || key === 'f') {
            // Toggling Fill
            switchFill.checked(!switchFill.checked());
        }
    }

    // Handle unselect tool event
    // Called when other tool gets selected
    this.unselectTool = function () {
        // Clear on screen shapes buffer
        onScreenShapes = [];

        // Get previously shaped canvas state
        let prevCanvasState = canvasState.getPreviousState();

        // Update the pixels array to match 
        // the previously shaped state
        for (let i = 0; i < pixels.length; i++) {
            pixels[i] = prevCanvasState[i];
        }

        // Update the canvas
        updatePixels();

        // Clear the options area
        select(".options").html("");
    }

    // Called when the instance 
    // of this tool is created
    initTool();
}