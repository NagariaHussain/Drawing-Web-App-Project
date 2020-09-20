/* -------- 
CONSTRUCTOR FUNCTION FOR TEXT TOOL
Use: Let's the user insert and edit text on the canvas.
--------- */

function TextTool() {
    // ===== PRIVATE MEMBERS =====
    // Constants
    const HOME_KEY_CODE = 35;
    const END_KEY_CODE = 36;

    // Array of font options
    const FONTS = [
        'Raleway',
        'Indie Flower',
        'Ranchers',
        'Inconsolata',
        'Metal Mania'
    ];

    // Variables
    let hasTypingStarted;
    let beforeStack;
    let afterStack;
    let textPosX;
    let textPosY;
    let textBeforeCursor;
    let textAfterCursor;
    let textRotation;

    let fontSizeSlider;
    let fontSelector;
    let textRotationSlider;

    // Functions

    // Initialize the text tool
    function initTool() {
        // Set typing started to false
        hasTypingStarted = false;

        // Set text rotation back to 0
        textRotation = 0;

        // Clear Buffer managed through stack
        clearTextBuffer();
    }

    // Function to clear the text buffer
    function clearTextBuffer() {
        // Empty out the stack holding the 
        // characters before the cursor
        beforeStack = [];

        // Empty out the stack holding the 
        // characters after the cursor
        afterStack = [];

        // Set texts to empty string
        textBeforeCursor = "";
        textAfterCursor = "";
    }

    // Draws a cursor to the canvas
    function drawCursor() {
        // Push new state
        push();

        // Remove any stroke
        noStroke();

        // Translate to the location where 
        // the text needs to be drawn
        translate(textPosX, textPosY);

        // Rotate by the amount textRotation
        // Updated through the rotation slider
        rotate(textRotation);

        // Draw the actual cursor to the canvas
        rect(textWidth(textBeforeCursor), 5, 2, -fontSizeSlider.value());

        // Pop this state
        pop();
    }

    // Draws the two parts of the text
    function drawTexts() {
        // Get the index of selected font from the index
        let selectedFontIndex = FONTS.indexOf(fontSelector.value());

        // Get the selected font from the fonts array
        let selectedFont = fonts[selectedFontIndex];

        // Set the font to the selected font
        textFont(selectedFont);

        // Set the font size to the value 
        // of font size control
        textSize(fontSizeSlider.value());

        // Update the pixels on the canvas
        updatePixels();

        // Clear the text variables 
        textBeforeCursor = "";
        textAfterCursor = "";

        // Create the text string that goes before the cursor
        // using the beforeStack buffer
        for (let c of beforeStack) {
            textBeforeCursor += c;
        }

        // Create the text string that goes after the cursor
        // using the afterStack buffer
        for (let i = afterStack.length - 1; i >= 0; i--) {
            textAfterCursor += afterStack[i];
        }

        // Push new config state
        push();
        // Translate to the location where text needs to be drawn
        translate(textPosX, textPosY);

        // Rotate by the required amount
        rotate(textRotation);

        // Draw the text before the cursor
        text(textBeforeCursor, 0, 0);

        // Draw the text after the cursor
        text(textAfterCursor, 0 + textWidth(textBeforeCursor), 0);

        // Pop this state
        pop();
    }

    // Reset typing state for new text insertion
    function resetTypingState() {

        // Set typing started flag to false
        hasTypingStarted = false;

        // Draw the text only
        drawTexts();

        // Save the text 
        loadPixels();

        // Reset the buffer
        clearTextBuffer();

        // Set the rotation back to 0
        textRotation = 0;

        // Change the rotation slider's 
        // value back to 0
        textRotationSlider.value(0);

        // Update status bar text for 7s
        statusBar.setTempText('Click anywhere on canvas to start typing', 7000);
    }

    // Handle font style / size change
    function handleFontStyleChange() {
        // If the user has started typing
        if (hasTypingStarted) {
            // Redraw the text and cursor
            // with updated text style
            drawTexts();
            drawCursor();
        }
    }

    // Handle text rotation angle change
    function handleTextRotate() {
        // Update the text rotation value
        textRotation = textRotationSlider.value();

        // If the user has started typing
        if (hasTypingStarted) {
            // Redraw the text and cursor
            // with updated rotation
            drawTexts();
            drawCursor();
        }
    }

    // ==== PUBLIC MEMBERS =====
    // Variables
    // Path to icon image file
    this.icon = "assets/icons/text.png";

    // Unique name for this tool
    this.name = "TextTool";

    // Methods
    // -------

    // Handle key press events from the user
    this.keyPressed = function (kCode) {
        // If the typing has been started
        if (hasTypingStarted) {
            // If these key are pressed
            // Save the text and reset the tool state.
            if (
                kCode === ENTER ||
                kCode === TAB ||
                kCode === ESCAPE ||
                kCode === RETURN
            ) {
                // Reset the typing state
                resetTypingState();

                // Don't draw the text from now!
                return;

            } 

            // If left arrow is pressed
            else if (kCode === LEFT_ARROW) {
                // Move cursor left 
                // Only if there is text in 
                // the beforeStack buffer
                if (!isStackEmpty(beforeStack)) {
                    // Update stack buffers
                    pushToStack(afterStack, popStack(beforeStack));
                }
            } 

            // If right arrow is pressed
            else if (kCode === RIGHT_ARROW) {
                // Move cursor right
                if (!isStackEmpty(afterStack)) {
                    // Update the stack buffer
                    pushToStack(beforeStack, popStack(afterStack));
                }
            } 

            // If the 'home' key is pressed
            else if (kCode === HOME_KEY_CODE) {
                // Move the cursor to the start of the text buffer
                while (!isStackEmpty(afterStack)) {
                    pushToStack(beforeStack, popStack(afterStack));
                }
            }
            
            // If the 'end' key is pressed
            else if (kCode === END_KEY_CODE) {
                // Move the cursor to the end of the text buffer
                while (!isStackEmpty(beforeStack)) {
                    pushToStack(afterStack, popStack(beforeStack));
                }
            } 

            // If the 'backspace <--' key is pressed
            else if (kCode === BACKSPACE) {
                // Remove one character from left of text
                // Only if there is text before the cursor
                if (!isStackEmpty(beforeStack)) {
                    // Pop a single character from the 
                    // before stack buffer
                    popStack(beforeStack);
                }
            } 
            
            // If the 'delete' key is pressed
            else if (kCode === DELETE) {
                // Remove one character from right of text
                // Only if there is text after the cursor
                if (!isStackEmpty(afterStack)) {
                    // Pop a single character from the a
                    // fter stack buffer
                    popStack(afterStack);
                }
            }

            // Draw the updated text and the cursor
            drawTexts();
            drawCursor();
        }
    }

    // Handle character key presses 
    this.keyTyped = function (key) {
        if (hasTypingStarted) {
            // Push to text buffer
            pushToStack(beforeStack, key);

            // Update canvas
            drawTexts();
            drawCursor();
        }
    }

    // Handle mouse clicks
    this.mousePressed = function (mx, my) {
        if (mouseInsideCanvas(canvas)) {
            // Turn on typing state
            if (!hasTypingStarted) {
                // Update tool state
                hasTypingStarted = true;
                textPosX = mx;
                textPosY = my;
                loadPixels();
                drawCursor();

                // Update status text
                statusBar.setText('Press enter to complete editing');
            }
        } else {
            if (hasTypingStarted) {
                updatePixels();
                drawTexts();
                drawCursor();
            }
        }
    }

    // Handle unselect tool
    this.unselectTool = function () {
        resetTypingState();
        clearTextBuffer();
        select(".options").html("");
    }

    // Handle tool initialization
    this.populateOptions = function () {
        // Element to append control elements to
        let menuSpace = select(".options");

        // Font Size Slider description text
        const fontSizeHeading = createP("Font Size: ");

        // Add some styling to the text
        fontSizeHeading.style("display", "inline-block");

        // Append to the DOM as a child of menuSpace
        fontSizeHeading.parent(menuSpace);

        // Font Size Slider Config
        fontSizeSlider = createSlider(10, 72, 22);
        fontSizeSlider.style("margin", "0 20px");
        
        // Attach callback
        fontSizeSlider.input(handleFontStyleChange);
        fontSizeSlider.style("display", "inline-block");
        
        // Make the slider child of 
        // the menuSpace DOM element
        fontSizeSlider.parent(menuSpace);

        // Text Rotation Slider description text
        const textRotationHeading = createP("Text Rotation: ");

        // Add some styling to the text
        textRotationHeading.style("display", "inline-block");

        // Append to the DOM as child 
        // of menuSpace element
        textRotationHeading.parent(menuSpace);

        // Font Rotation Slider Config
        textRotationSlider = createSlider(0, Math.PI * 2, 0, 0.01);

        // Add some styling to the slider
        textRotationSlider.style("margin", "0 20px");
        textRotationSlider.addClass('val');

        // Attach event listening callback
        textRotationSlider.input(handleTextRotate);

        // Make the slider child of 
        // the menuSpace DOM element
        textRotationSlider.parent(menuSpace);

        // Font Family Select description text
        const fontFamilyHeading = createP("Font Family: ");

        // Add some styling to the text
        fontFamilyHeading.style("display", "inline-block");
        fontFamilyHeading.style("margin", "0 20px");

        // Make the text a child of 
        // the menuSpace DOM element
        fontFamilyHeading.parent(menuSpace);

        // Font Family Select Config
        fontSelector = createSelect();
        fontSelector.parent(menuSpace);

        // Populate the select element
        for (let font of FONTS) {
            fontSelector.option(font);
        }

        // Handle Font Style changed event
        fontSelector.changed(handleFontStyleChange);

        // Update status bar text
        statusBar.setText('Press anywhere on canvas to insert text');
    }

    // Initialize tool on initialization of TextTool object
    initTool();
}