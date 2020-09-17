/* -------- 
CONSTRUCTOR FUNCTION FOR IMAGE TOOL
--------- */
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
    var self = this;

    // ===== PUBLIC MEMBERS =====
    // Variables
    this.icon = 'assets/icons/image.png';
    this.name = 'InsertImageTool';
    this.currentImage = null;

    this.populateOptions = function() {
        let menuSpace = select(".options");

        // Controllers
        imagePicker = createFileInput(handleFilePick);
        imagePicker.parent(menuSpace);

        // Manually creating finish button due to p5 Bug.
        finishButton = document.createElement('button');
        finishButton.innerText = "Finish";
        menuSpace.child(finishButton);
        finishButton.addEventListener('click', handleFinishEdit);

        widthController = createSlider(5, width, 10);
        widthController.parent(menuSpace);
        widthController.input(handleWidthChange);

        heightController = createSlider(5, height, 10);
        heightController.parent(menuSpace);
        heightController.input(handleHeightChange);


        maintainPropotionCheckbox = createCheckbox('Maintain propotions', true);
        maintainPropotionCheckbox.parent(menuSpace);
    }

    this.unselectTool = function() {
        if (this.currentImage) {
            handleFinishEdit();
            this.currentImage = null;
        }

        select(".options").html("");
    }

    // Handle mouse dragged event
    this.mouseDragged = function() {
        if (this.currentImage != null &&
            isMouseInsideImage(mouseX, mouseY, this.currentImage) &&
            mouseInsideCanvas(canvas)) {
            updatePixels();

            if (!mouseDragStarted) {
                mouseDragStarted = true;
                dragStartX = mouseX;
                dragStartY = mouseY;
            }

            // Move the image on screen
            this.currentImage.x += (mouseX - dragStartX) / 10;
            this.currentImage.y += (mouseY - dragStartY) / 10;

            // Draw the updated image
            drawBoundingBox();
            drawCurrentImage();
        }
    }

    // Handle mouse released event
    this.mouseReleased = function() {
        updatePixels();

        if (mouseDragStarted) {
            this.currentImage.x += (mouseX - dragStartX) / 10;
            this.currentImage.y += (mouseY - dragStartY) / 10;
        }

        mouseDragStarted = false;
        drawCurrentImage();
        drawBoundingBox();
    }

    // ===== Private Methods ===== 
    function initTool() {
        loadPixels();

        // Currently not being edited
        beingEdited = false;
        mouseDragStarted = false;
    }

    // Exit Edit mode and save image to canvas
    function handleFinishEdit() {
        // Draw and save the final image
        updatePixels();
        if (self.currentImage) {
            drawCurrentImage();
        }

        loadPixels();
        self.currentImage = null;
        beingEdited = false;
    }

    // Function to handle file picked event
    function handleFilePick(file) {
        // Save any previously picked image not yet saved
        handleFinishEdit();

        // Turn on edit mode
        beingEdited = true;

        if (file.type === 'image') {
            // Update status bar text
            statusBar.setTempText("Image file picked", 3000);
            handleImageFile(file.data);
        } else {
            // Update Status bar text
            statusBar.setText("Please choose an image file!");
        }
    }

    function handleImageFile(data) {
        let elt = document.createElement("img");
        elt.src = data;
        elt.addEventListener('load', () => {
            imgData = loadImage(elt.src, (img) => {
                self.currentImage = new CreateImage(img, width / 2, height / 2, img.height, img.width);
                // Draw image with bounding box
                drawCurrentImage();
                drawBoundingBox();

                // Reset to default values
                imagePicker.value('');
                widthController.value(img.width);
                heightController.value(img.height);
                maintainPropotionCheckbox.checked(true);
            });
        });
    }

    function handleWidthChange() {
        if (self.currentImage) {
            if (maintainPropotionCheckbox.checked()) {
                let ratio = self.currentImage.height / self.currentImage.width;
                self.currentImage.width = widthController.value();
                self.currentImage.height = self.currentImage.width * ratio;
                heightController.value(self.currentImage.height);
            } else {
                self.currentImage.width = widthController.value();
            }
            drawCurrentImage();
            drawBoundingBox();
        }
    }

    function handleHeightChange() {
        if (self.currentImage) {
            if (maintainPropotionCheckbox.checked()) {
                let ratio = self.currentImage.width / self.currentImage.height;
                self.currentImage.height = heightController.value();
                self.currentImage.width = self.currentImage.height * ratio;
                widthController.value(self.currentImage.width);
            } else {
                self.currentImage.height = heightController.value();
            }
            drawCurrentImage();
            drawBoundingBox();
        }
    }

    // Draw the current image to the canvas
    function drawCurrentImage() {
        updatePixels();
        if (self.currentImage) {
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
        if (beingEdited) {
            push();
            translate(self.currentImage.x, self.currentImage.y);
            noFill();
            stroke(0, 200, 120);
            strokeWeight(5);
            // Bounding rectangle
            rect(-10, -10, self.currentImage.width + 20, self.currentImage.height + 20);
            pop();
        }
    }

    // Returns true if given mouse coords inside the image object
    function isMouseInsideImage(mx, my, imgObject) {
        // For debugging only
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