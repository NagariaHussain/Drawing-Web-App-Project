/* -------- 
CONSTRUCTOR FUNCTION FOR TEXT TOOL
--------- */

function TextTool() {
    // ===== PRIVATE MEMBERS =====
    // Constants
    const HOME_KEY_CODE = 35;
    const END_KEY_CODE = 36;
    const fonts = [
        'Inconsolata',
        'Indie Flower',
        'Metal Mania',
        'Raleway',
        'Raleway Thin'
    ];

    // Varibles
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
    function initTool() {
        hasTypingStarted = false;
        textRotation = 0;

        // Clear Buffer managed through stack
        clearTextBuffer();
    }

    function clearTextBuffer() {
        // Initially no text in buffer
        beforeStack = [];
        afterStack = [];

        // Empty text on both sides of the cursor
        textBeforeCursor = "";
        textAfterCursor = "";
    }

    // Draws a cursor to the canvas
    function drawCursor() {
        push();
        noStroke();
        translate(textPosX, textPosY);
        rotate(textRotation);
        rect(textWidth(textBeforeCursor), 5, 2, -fontSizeSlider.value());
        pop();
    }

    // Draws the two parts of the text
    function drawTexts() {
        textFont(fontSelector.value());
        textSize(fontSizeSlider.value());

        updatePixels();
        textBeforeCursor = "";
        for (c of beforeStack) {
            textBeforeCursor += c;
        }

        // Printing the text after the cursor        
        textAfterCursor = "";
        for (let i = afterStack.length - 1; i >= 0; i--) {
            textAfterCursor += afterStack[i];
        }

        push();
        translate(textPosX, textPosY);
        rotate(textRotation);
        text(textBeforeCursor, 0, 0);
        text(textAfterCursor, 0 + textWidth(textBeforeCursor), 0);
        pop();
    }

    // Reset for new text insertion
    function resetTypingState() {
        hasTypingStarted = false;
        drawTexts();

        // Save the text 
        loadPixels();

        // Reset the buffer
        clearTextBuffer();

        // Rotate back to normal
        textRotation = 0;
        textRotationSlider.value(0);

        // Update status bar text
        statusBar.setTempText('Click anywhere on canvas to start typing', 7000);
    }

    // Handle font size change
    function handleFontStyleChange() {
        if (hasTypingStarted) {
            drawTexts();
            drawCursor();
        }
    }

    // Handle text rotation angle change
    function handleTextRotate() {
        textRotation = textRotationSlider.value();
        if (hasTypingStarted) {
            drawTexts();
            drawCursor();
        }
    }

    // ==== PUBLIC MEMBERS =====
    // Variables
    this.icon = "assets/icons/text.png";
    this.name = "TextTool";

    // Methods
    // Handle key presses
    this.keyPressed = function(kCode) {
        if (hasTypingStarted) {
            // Manage key types
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
            } else if (kCode === LEFT_ARROW) {
                // Move cursor left
                if (!isStackEmpty(beforeStack)) {
                    pushToStack(afterStack, popStack(beforeStack));
                }
            } else if (kCode === RIGHT_ARROW) {
                // Move cursor right
                if (!isStackEmpty(afterStack)) {
                    pushToStack(beforeStack, popStack(afterStack));
                }
            } else if (kCode === HOME_KEY_CODE) {
                while (!isStackEmpty(afterStack)) {
                    pushToStack(beforeStack, popStack(afterStack));
                }
            } else if (kCode === END_KEY_CODE) {
                while (!isStackEmpty(beforeStack)) {
                    pushToStack(afterStack, popStack(beforeStack));
                }
            } else if (kCode === BACKSPACE) {
                // Remove one character from left of text
                if (!isStackEmpty(beforeStack)) {
                    popStack(beforeStack);
                }
            } else if (kCode === DELETE) {
                // Remove one character from right of text
                if (!isStackEmpty(afterStack)) {
                    popStack(afterStack);
                }
            }
            // Draw the updated text and the cursor
            drawTexts();
            drawCursor();
        }
    }

    // Handle character key presses 
    this.keyTyped = function(key) {
        if (hasTypingStarted) {
            // Push to text buffer
            pushToStack(beforeStack, key);

            // Update canvas
            drawTexts();
            drawCursor();
        }
    }

    // Handle mouse clicks
    this.mousePressed = function(mx, my) {
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
    this.unselectTool = function() {
        resetTypingState();
        clearTextBuffer();
        select(".options").html("");
    }

    // Handle tool initialization
    this.populateOptions = function() {
        // Element to append control elements to
        let menuSpace = select(".options");

        // Font Size Slider description text
        const fontSizeHeading = createP("Font Size: ");
        fontSizeHeading.style("display", "inline-block");
        fontSizeHeading.parent(menuSpace);

        // Font Size Slider Config
        fontSizeSlider = createSlider(10, 72, 22);
        fontSizeSlider.style("margin", "0 20px");
        fontSizeSlider.input(handleFontStyleChange);
        fontSizeSlider.style("display", "inline-block");
        fontSizeSlider.parent(menuSpace);

        // Text Rotation Slider description text
        const textRotationHeading = createP("Text Rotation: ");
        textRotationHeading.style("display", "inline-block");
        textRotationHeading.parent(menuSpace);

        // Font Rotation Slider Config
        textRotationSlider = createSlider(0, Math.PI * 2, 0, 0.01);
        textRotationSlider.style("margin", "0 20px");
        textRotationSlider.addClass('val');
        textRotationSlider.input(handleTextRotate);
        textRotationSlider.parent(menuSpace);

        // Font Family Select description text
        const fontFamilyHeading = createP("Font Family: ");
        fontFamilyHeading.style("display", "inline-block");
        fontFamilyHeading.style("margin", "0 20px");
        fontFamilyHeading.parent(menuSpace);

        // Font Family Select Config
        fontSelector = createSelect();
        fontSelector.parent(menuSpace);

        // Populate the select element
        for (let font of fonts) {
            fontSelector.option(font);
        }

        // Handle Font Style changed event
        fontSelector.changed(handleFontStyleChange);

        // Update status bar text
        statusBar.setText('Press anywhere on canvas to insert text');
    }

    // Initialize tool on first creation
    initTool();
}