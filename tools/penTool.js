/* -------- 
CONSTRUCTOR FUNCTION FOR PEN (Editable Shape) TOOL
--------- */

function PenTool() {
    // PUBLIC VARIABLES
    this.icon = "assets/icons/pen.png";
    this.name = "PenTool";

    // PRIVATE VARIABLES
    let editButton;
    let finishButton;
    let undoButton;
    let currentShape = [];
    let editMode = false;

    // PUBLIC METHODS
    this.draw = function() {
        updatePixels();
        noFill();

        // The polygon shape
        beginShape();
        for (let v of currentShape) {
            vertex(v.x, v.y);
            if (editMode) {
                push();
                noStroke();
                fill(255, 0, 0);
                ellipse(v.x, v.y, 10, 10);
                pop();
            }
        }

        // To show the state after the 
        // new vertex will be inserted
        if (mouseInsideCanvas(canvas) && !editMode) {
            vertex(mouseX, mouseY);
        }

        // Editing the position of a vertex
        if (mouseIsPressed && editMode) {
            for (let v of currentShape) {
                if (dist(v.x, v.y, mouseX, mouseY) < 5) {
                    v.x = mouseX;
                    v.y = mouseY;
                }
            }
        }

        endShape();
    };

    this.mousePressed = function(mx, my) {
        if (mouseInsideCanvas(canvas) && !editMode) {
            currentShape.push({
                x: mx,
                y: my
            });
        }
    };

    this.mouseDragged = function(mx, my) {
        if (editMode) {

        }
    };

    this.populateOptions = function () {
        // Creating DOM button elements
        editButton = createButton("Edit");
        finishButton = createButton("Finish");
        undoButton = createButton("Undo point insert");

        // Adding click listeners
        editButton.elt.addEventListener("click", handleEditPress);
        finishButton.elt.addEventListener("click", handleFinishPress);
        undoButton.elt.addEventListener("click", handleUndo);

        // Appending buttons to the DOM
        select(".options").child(editButton);
        select(".options").child(finishButton);
        select(".options").child(undoButton);

        // Save current canvas state
        loadPixels();
    };

    this.unselectTool = function() {
        select(".options").html("");
        handleFinishPress();
    };

    // PRIVATE METHODS
    function handleEditPress() {
        editMode = true;
    }

    function handleFinishPress() {
        editMode = false;
        redraw();
        loadPixels();
        currentShape = [];
    }

    function handleUndo() {
        if (currentShape.length > 0) {
            currentShape.pop();
        }
    }
}