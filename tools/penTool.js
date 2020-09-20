/* -------- 
CONSTRUCTOR FUNCTION FOR PEN (Editable Shape) TOOL
Use: To draw polygons with editable vertices
--------- */

function PenTool() {
    // PUBLIC VARIABLES
    // Unique tool name
    this.name = "PenTool";

    // Path to tool icon image file
    this.icon = "assets/icons/pen.png";

    // PRIVATE VARIABLES
    // To hold a refernce 
    // to button elements
    let editButton;
    let finishButton;
    let undoButton;

    // To hold an array of vertices
    let currentShape = [];

    // To manage edit state
    let editMode = false;

    // PUBLIC METHODS
    this.draw = function() {
        // Update the canvas to match the 
        // state of the pixels array
        updatePixels();

        // Remove any fill
        noFill();

        // The polygon shape
        beginShape();

        // Iterate over each of the vertices
        for (let v of currentShape) {
            // Draw the vertex
            vertex(v.x, v.y);

            // If the user is in edit mode
            if (editMode) {
                // Push new state
                push();

                // Remove any stroke
                noStroke();

                // Set fill to red
                fill(255, 0, 0);
                
                // Draw a red dot
                ellipse(v.x, v.y, 10, 10);

                // Pop off this state
                pop();
            }
        }

        // To show the state after the 
        // new vertex will be inserted
        // Only if mouse is inside canvas 
        // and edit mode is off
        if (mouseInsideCanvas(canvas) && !editMode) {
            vertex(mouseX, mouseY);
        }

        // Editing the position of a vertex
        // If mouse is pressed and edit mode is on
        if (mouseIsPressed && editMode) {
            // For every vertex in current shape
            for (let v of currentShape) {
                // Check if the mouse is less than 
                // 5px from the point v
                if (dist(v.x, v.y, mouseX, mouseY) < 5) {
                    // Update the coordinates of this vertex 
                    // to match the mouse coordinates
                    v.x = mouseX;
                    v.y = mouseY;
                }
            }
        }

        // End Drawing the shape
        endShape();
    };

    // Handle deligated mouse pressed event
    this.mousePressed = function(mx, my) {
        // If mouse is inside the canvas 
        // and edit mode is off
        if (mouseInsideCanvas(canvas) && !editMode) {
            // Push the new vertex to 
            // the current shape array
            currentShape.push({
                x: mx,
                y: my
            });
        }
    };

    // Method to populate the options area
    this.populateOptions = function () {
        // Creating DOM button elements
        // Create an edit button
        editButton = createButton("Edit");

        // Create a finish button
        finishButton = createButton("Finish");

        // Create an undo point button
        undoButton = createButton("Undo point insert");

        // Adding click listeners
        // Add click listener to edit button
        editButton.elt.addEventListener("click", handleEditPress);

        // Add click listener to finish button
        finishButton.elt.addEventListener("click", handleFinishPress);

        // Add click listener to undo button
        undoButton.elt.addEventListener("click", handleUndo);

        // Appending buttons to the DOM
        // Append edit button as a child of options area
        select(".options").child(editButton);

        // Append finish button as a child of options area
        select(".options").child(finishButton);

        // Append undo button as a child of options area
        select(".options").child(undoButton);

        // Save current canvas state
        loadPixels();
    };

    // Called when another tool gets selected
    this.unselectTool = function() {
        // Clear the options area
        select(".options").html("");

        // Finish editing any unsaved shape
        handleFinishPress();
    };

    // PRIVATE METHODS
    // Called when user presses the edit button
    function handleEditPress() {
        // Turn on edit mode
        editMode = true;
    }

    // Called when finish button is pressed
    function handleFinishPress() {
        // Turn off edit mode
        editMode = false;

        // Redraw the frame without dots
        redraw();

        // Load the current state of 
        // canvas into pixels array
        loadPixels();

        // Clear the current shape buffer
        currentShape = [];
    }

    // Called when the undo button is pressed
    function handleUndo() {
        // If the current shape has atleast one vertex
        if (currentShape.length > 0) {
            // Remove the last inserted 
            // vertex from the buffer
            currentShape.pop();
        }
    }
}