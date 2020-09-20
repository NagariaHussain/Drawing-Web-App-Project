// ================================
// sketch.js File
// ================================

// Global variables that will store the toolbox colour palette
// and the helper functions
var toolbox = null;
var colourP = null;
var helpers = null;

// To store canvas element
var canvas;
// To store the current canvasState Object
var canvasState;
// To store the statusBar Object
var statusBar;
// To store the mouse icon controller Object
var mouseIconController;
// To track the current fill color
var fillColor;
// Array of loaded fonts
var fonts = [];

function preload() {
	// Loading fonts for Text tool
	// And storing them in the fonts Array

	// 'Raleway Light'
	fonts.push(loadFont('assets/fonts/Raleway-Light.ttf'));
	// 'Indie Flower'
	fonts.push(loadFont('assets/fonts/IndieFlower-Regular.ttf'));
	// 'Ranchers'
	fonts.push(loadFont('assets/fonts/Ranchers-Regular.ttf'));
	// 'Inconsolata Light'
	fonts.push(loadFont('assets/fonts/Inconsolata-Light.ttf'));
	// 'Metal Mania' 
	fonts.push(loadFont('assets/fonts/MetalMania-Regular.ttf'));
}

function setup() {

	//create a canvas to fill the content div from index.html
	canvasContainer = select('#content');
	canvas = createCanvas(canvasContainer.size().width, canvasContainer.size().height);
	canvas.parent("content");

	// Maintain pixels scaling on high pixel density displays.
	pixelDensity(1);

	// Canvas State controller
	// Manages the current state 
	// of the pixels array
	canvasState = new CanvasState(canvas);

	// Status Bar Object
	// Manages the status bar text
	statusBar = new StatusBar();

	// Mouse Icon Controller Object
	mouseIconController = new MouseIconController();

	// Create helper functions and the colour palette
	helpers = new HelperFunctions();
	colourP = new ColourPalette();

	// Create a toolbox for storing the tools
	toolbox = new Toolbox();

	// Add the tools to the toolbox.
	toolbox.addTool(new FreehandTool());
	toolbox.addTool(new LineToTool());
	toolbox.addTool(new SprayCanTool());
	toolbox.addTool(new mirrorDrawTool());

	// -----------------------------------
	// Student created tools
	// Text tool
	toolbox.addTool(new TextTool());
	// Image tool
	toolbox.addTool(new ImageTool());
	// Shape tool
	toolbox.addTool(new ShapeTool());
	// Erasor tool
	toolbox.addTool(new EraserTool());
	// Shape compose tool
	toolbox.addTool(new ShapeComposeTool());
	// Bucket Fill tool
	toolbox.addTool(new BucketFillTool());
	// Pen tool (Editable Shape tool)
	toolbox.addTool(new PenTool());
	// -----------------------------------

	// Set the background to white
	background(255);
}

function draw() {
	// Call the draw function from the selected tool.
	if (toolbox.selectedTool.hasOwnProperty("draw")) {
		toolbox.selectedTool.draw();
	}

	// Updating mouse coordinates in the status bar
	// only when the areMouseCoordsShown is set to True
	if (statusBar.areMouseCoordsShown()) {
		// Update x, y coordinate pair
		statusBar.updateStatusText();
	}

	// Draw the mouse icon if
	// tool has mouse icon url
	if (toolbox.selectedTool.hasOwnProperty("mouseIconUrl")) {
		// Draw icon next to mouse pointer
		mouseIconController.draw();
	}
}

// =======================================
// Pass on the events to the selected tool
// =======================================

function mousePressed() {
	// If the selected tool has mousePressed property
	if (toolbox.selectedTool.hasOwnProperty("mousePressed")) {
		// Call it's mousePressed property and 
		// pass the current mouse coordinates
		toolbox.selectedTool.mousePressed(mouseX, mouseY);
	}
}

function mouseDragged() {
	// If the selected tool has mouseDragged property
	if (toolbox.selectedTool.hasOwnProperty("mouseDragged")) {
		// Call it's mouseDragged property and 
		// pass the current mouse coordinates
		toolbox.selectedTool.mouseDragged(mouseX, mouseY);
	}
}

function mouseReleased() {
	// If the selected tool has mouseReleased property
	if (toolbox.selectedTool.hasOwnProperty("mouseReleased")) {
		// Call it's mouseReleased property and 
		// pass the current mouse coordinates
		toolbox.selectedTool.mouseReleased(mouseX, mouseY);
	}
}

function keyTyped() {
	// If the selected tool has keyTyped property
	if (toolbox.selectedTool.hasOwnProperty("keyTyped")) {
		// Call it's keyTyped property and 
		// pass the current key
		toolbox.selectedTool.keyTyped(key);
	}
}

function keyPressed() {
	// If the selected tool has keyPressed property
	if (toolbox.selectedTool.hasOwnProperty("keyPressed")) {
		// Call it's keyPressed property and 
		// pass the current keyCode
		toolbox.selectedTool.keyPressed(keyCode);
	}
}

// ================================
// End of File
// ================================
