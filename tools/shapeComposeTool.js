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
    }

    // Genarate Polygon based on selected operation
    function performOperation() {

        if (onScreenShapes.length < 2) {
            alert("Draw atleast 2 shapes to perform boolean operations");
            return;
        }
        loadPixels();
        let prevCanvasState = canvasState.getPreviousState();
        for (let i = 0; i < pixels.length; i++) {
            pixels[i] = prevCanvasState[i];
        }
        updatePixels();
        loadPixels();

        // Converting shapes array into array of vertices array
        const onScreenShapeVertices = onScreenShapes.map(
            (shape) => shape.getVertices()
        );

        // Generating the polygon
        let generatedPolygon;
        let operationFunction;

        // Polygon generation based on value of selector
        switch(operationSelector.value()) {
            case "UNION": {
                statusBar.setText("Performing union..");
                operationFunction = union;
                break;
            }
            case "INTERSECTION": {
                operationFunction = intersection$1;
                break;
            }
            case "XOR": {
                operationFunction = xor;
                break;
            }
            case "DIFFERENCE": {
                operationFunction = difference;
                break;
            }
        }

        // Perform the generated operation
        generatedPolygon = operationFunction(...onScreenShapeVertices);
        
        // Drawing the generated polygon
        push();
        // Switch fill based on check fill
        if (!switchFill.checked()) {
            noFill();
        }

        // Draw the generated polgon(s)
        for (let i = 0; i < generatedPolygon.length; i++) {
            beginShape();
            for (let v of generatedPolygon[i][0]) {
                vertex(v[0], v[1]);
            }
            endShape(CLOSE);
        }

        pop();
        loadPixels();
        canvasState.saveState();
        onScreenShapes = [];

        // Update status bar text
        statusBar.setTempText('Composed Polgygon Created.', 4000);
    }

    // Handle mouse release event
    this.mouseReleased = function () {
        if (isUserDrawing && mouseInsideCanvas(canvas)) {
            if (currentShape.isValid()) {
                loadPixels();
                onScreenShapes.push(currentShape);
                resetState();
            }

            // Update status bar text
            statusBar.setTempText(`${onScreenShapes.length} shapes for combination.`, 5000);
        }
    }

    // Called by the p5 draw function
    this.draw = function () {
        push();
        if (!switchFill.checked()) {
            noFill();
        }
        drawShape();
        pop();
    }

    // Handle tool context options creation
    this.populateOptions = function () {
        loadPixels();
        // Save the canvas state
        canvasState.saveState();
        let menuSpace = select(".options");

        // Button to toggle fill of shapes
        switchFill = createCheckbox('Is filled', false);
        switchFill.parent(menuSpace);

        // Shape select menu
        shapeSelecter = createSelect();
        shapeSelecter.parent(menuSpace);
        for (shape of shapes) {
            shapeSelecter.option(shape);
        }

        shapeSelecter.changed(shapeChanged);
        shapeSelecter.selected('rectangle');

        // Operation select menu
        operationSelector = createSelect();
        operationSelector.parent(menuSpace);
        for (let o of operationOptions) {
            operationSelector.option(o);
        }

        finishButton = document.createElement('button');
        finishButton.innerText = 'Perform';
        finishButton.addEventListener('click', performOperation);

        document.getElementsByClassName("options")[0].appendChild(finishButton);
    }

    // Handle key press events 
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

    // Handle unselect tool event
    this.unselectTool = function () {
        onScreenShapes = [];
        let prevCanvasState = canvasState.getPreviousState();
        for (let i = 0; i < pixels.length; i++) {
            pixels[i] = prevCanvasState[i];
        }
        updatePixels();
        select(".options").html("");
    }

    initTool();
}