/* -------- 
CONSTRUCTOR FUNCTION FOR IMAGE TOOL
--------- */

// Global variable to store 
// the loaded image data
var imgData;

function ImageTool() {

    // ===== PRIVATE MEMBERS =====
    // Variables 
    let imagePicker;
    let finishButton;
    let beingEdited;

    // Drag state control
    let mouseDragStarted;
    let dragStartX;
    let dragStartY;

    // Size controls
    let widthController;
    let heightController;
    let maintainPropotionCheckbox;

    // For scope work around
    let self = this;

    // ===== PUBLIC MEMBERS =====
    // Variables
    this.icon = 'assets/icons/image.png';
    this.name = 'InsertImageTool';
    this.currentImage = null;

    // Method to be called to populate options 
    // and controls related with this tool
    this.populateOptions = function() {
        // Get access to the options area
        let menuSpace = select(".options");

        // Controllers

        // Create a file picker element
        imagePicker = createFileInput(handleFilePick);

        // Make the image picker a child of the 
        // menuSpace element in the DOM
        imagePicker.parent(menuSpace);

        // Manually creating finish button due to p5 Bug.
        // Create a button DOM element
        finishButton = document.createElement('button');

        // Set the inner text to 'finish'
        finishButton.innerText = "Finish";

        // Make the finish button a child 
        // to menuSpace element in the DOm
        menuSpace.child(finishButton);

        // Attach event listener to the finish button
        finishButton.addEventListener('click', handleFinishEdit);

        // Create a width control slider element
        widthController = createSlider(5, width, 10);

        // Make the width slider, a child of 
        // the menuSpace element inside the DOM
        widthController.parent(menuSpace);

        // Attach event listener to the slider
        widthController.input(handleWidthChange);

        // Create a slider for 
        // controlling height of image
        heightController = createSlider(5, height, 10);

        // Make the height slider, a child of
        // the menuSpace element inside the DOM
        heightController.parent(menuSpace);

        // Attach event listener
        // and provide a callback funtion
        heightController.input(handleHeightChange);

        // Create a checkbox with initial value 
        // to be 'checked'
        maintainPropotionCheckbox = createCheckbox('Maintain propotions', true);

        // Make the checkbox, a child of 
        // menuSpace element in the DOM
        maintainPropotionCheckbox.parent(menuSpace);
    }

    // Method to be called when 
    // another tool gets selected
    this.unselectTool = function() {
        // If there is an image in the buffer
        if (this.currentImage) {
            // Finish editing the image
            // and draw it to the canvas
            handleFinishEdit();

            // Clear the image buffer
            this.currentImage = null;
        }

        // Empty out the options area
        select(".options").html("");
    }

    // Handle mouse dragged event
    // Helps in moving the image 
    // around the canvas
    this.mouseDragged = function() {
        // If there is an image in the buffer
        // and mouse is inside the image
        // and mouse is also inside the canvas
        if (this.currentImage != null &&
            isMouseInsideImage(mouseX, mouseY, this.currentImage) &&
            mouseInsideCanvas(canvas)) {
            updatePixels();
            
            // If mouse drag not already started
            if (!mouseDragStarted) {
                // Start the mouse drag
                mouseDragStarted = true;
                // Set initial mouse coordinates
                dragStartX = mouseX;
                dragStartY = mouseY;
            }

            // Else, when the mouse drag has already started
            // Move the image on screen with the mouse
            this.currentImage.x += (mouseX - dragStartX) / 10;
            this.currentImage.y += (mouseY - dragStartY) / 10;

            // Draw the bounding box with 
            // updated coordinates
            drawBoundingBox();
            // Draw the updated image
            drawCurrentImage();
        }
    }

    // Handle mouse released event
    this.mouseReleased = function() {

        // Update the canvas
        updatePixels();

        // If mouse drag has started
        if (mouseDragStarted) {
            // Update the image coordinated
            this.currentImage.x += (mouseX - dragStartX) / 10;
            this.currentImage.y += (mouseY - dragStartY) / 10;
        }

        // Set mouse drag started to false
        mouseDragStarted = false;

        // Draw the bounding box and the 
        // image with updated coordinates (position)
        drawCurrentImage();
        drawBoundingBox();
    }

    // ===== Private Methods ===== 
    // Function to initialize this tool
    function initTool() {
        // Save the current canvas state to 
        // the pixels array
        loadPixels();

        // Currently not being edited
        beingEdited = false;
        // Set currently being dragged to false
        mouseDragStarted = false;
    }

    // Exit Edit mode and save image to canvas
    function handleFinishEdit() {
        // Update the canvas to 
        // match the pixel array state
        updatePixels();

        // If there is an image in the buffer
        if (self.currentImage) {
            // Draw the image only
            // Not the bounding box
            drawCurrentImage();
        }

        // Load the new state to the pixels array
        loadPixels();

        // Clear the current image buffer
        self.currentImage = null;

        // Reset being edited to false
        beingEdited = false;
    }

    // Function to handle file picked event
    function handleFilePick(file) {
        // Save any previously picked image not yet saved
        handleFinishEdit();

        // Turn on edit mode
        beingEdited = true;

        // If an image file is selected
        if (file.type === 'image') {
            // Update status bar text
            statusBar.setTempText("Image file picked", 3000);

            // Handle the image file
            handleImageFile(file.data);
        } 
        // If any other type of file is selected 
        else {
            // Notify the user
            statusBar.setText("Please choose an image file!");
        }
    }

    function handleImageFile(data) {
        // Create an image DOM element
        let elt = document.createElement("img");

        // Set the source to the loaded data
        elt.src = data;

        // Attach event listener to the 
        // DOM image element
        elt.addEventListener('load', () => {

            // When the image data has completed loading
            imgData = loadImage(elt.src, (img) => {

                // Create a new Image object
                // and update the current image buffer
                self.currentImage = new CreateImage(img, width / 2, height / 2, img.height, img.width);
               
                // Draw image with bounding box
                // to the canvas
                drawCurrentImage();
                drawBoundingBox();

                // Reset to default values
                // Remove any previous file selections
                imagePicker.value('');

                // Update the values of width and height 
                // slider to the initail image dimensions
                widthController.value(img.width);
                heightController.value(img.height);

                // Check off the maintain propotions option
                maintainPropotionCheckbox.checked(true);
            });
        });
    }

    // Callback to handle width change
    function handleWidthChange() {
        // If there is an image in the buffer
        if (self.currentImage) {
            // If maintain propotions is true
            if (maintainPropotionCheckbox.checked()) {
                // Get the aspect ratio
                let ratio = self.currentImage.height / self.currentImage.width;

                // Update the width value
                self.currentImage.width = widthController.value();

                // Update the height value according 
                // to the new width value
                self.currentImage.height = self.currentImage.width * ratio;

                // Update height control slider's value
                heightController.value(self.currentImage.height);
            } 

            // If maintain propotions is false
            else {
                // Update the width only
                self.currentImage.width = widthController.value();
            }

            // Draw the updated image and bounding box
            drawCurrentImage();
            drawBoundingBox();
        }
    }

    // Function to handle height change
    function handleHeightChange() {
        // If there is an image in the buffer
        if (self.currentImage) {
            // If maintain propotions is true
            if (maintainPropotionCheckbox.checked()) {
                // Calculate the image aspect ratio
                let ratio = self.currentImage.width / self.currentImage.height;

                // Update the image height value
                self.currentImage.height = heightController.value();

                // Update the image width according 
                // to the new height value
                self.currentImage.width = self.currentImage.height * ratio;

                // Update the value of the width slider value
                widthController.value(self.currentImage.width);
            } 
            // If maintain propotions is set to false
            else {

                // Update the height only
                self.currentImage.height = heightController.value();
            }

            // Draw the updated image 
            // and bounding box
            drawCurrentImage();
            drawBoundingBox();
        }
    }

    // Draw the current image to the canvas
    function drawCurrentImage() {
        // Update the canvas state to 
        // match the pixels array
        updatePixels();

        // If there is an image in the buffer
        if (self.currentImage) {
            // Draw the current image to the canvas
            image(
                self.currentImage.data,
                self.currentImage.x,
                self.currentImage.y,
                self.currentImage.width,
                self.currentImage.height
            );
        }
    }

    // Draw a bounding box around the image
    function drawBoundingBox() {
        // If the image is in edit mode
        if (beingEdited) {
            // Push new state
            push();
            // Translate to the location where the 
            // box is required to be drawn
            // according to the image coordinates
            translate(self.currentImage.x, self.currentImage.y);

            // Remove any fill
            noFill();

            // Set a stroke color
            stroke(0, 200, 120);

            // Set the stroke width to 5
            strokeWeight(5);

            // Draw Bounding rectangle
            // according to the image dimensions
            rect(-10, -10, self.currentImage.width + 20, self.currentImage.height + 20);

            // Pop off this state
            pop();
        }
    }

    // Returns true if given mouse coords inside the image object
    function isMouseInsideImage(mx, my, imgObject) {
        return (
            (mx >= imgObject.x) &&
            (mx <= (imgObject.x + imgObject.width)) &&
            (my >= imgObject.y) &&
            (my <= (imgObject.y + imgObject.height))
        );
    }

    // Initializing the image tool
    initTool();
}