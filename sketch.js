//global variables that will store the toolbox colour palette
//amnd the helper functions
var toolbox = null;
var colourP = null;
var helpers = null;
var canvas;
var canvasState;
var statusBar;
var mouseIconController;
var fillColor;

function preload() {
	// TODO: Load Fonts
}
function setup() {

	//create a canvas to fill the content div from index.html
	canvasContainer = select('#content');
	canvas = createCanvas(canvasContainer.size().width, canvasContainer.size().height);
	canvas.parent("content");

	// Maintain pixels scaling on high pixel density displays.
	pixelDensity(1);
	
	// State controller
	canvasState = new CanvasState(canvas);

	// Status Bar Object
	statusBar = new StatusBar();

	// Mouse Icon Controller Object
	mouseIconController = new MouseIconController();

	//create helper functions and the colour palette
	helpers = new HelperFunctions();
	colourP = new ColourPalette();

	//create a toolbox for storing the tools
	toolbox = new Toolbox();

	//add the tools to the toolbox.
	toolbox.addTool(new FreehandTool());
	toolbox.addTool(new LineToTool());
	toolbox.addTool(new SprayCanTool());
	toolbox.addTool(new mirrorDrawTool());
	toolbox.addTool(new TextTool());
	toolbox.addTool(new ImageTool());
	toolbox.addTool(new ShapeTool());
	toolbox.addTool(new EraserTool());
	toolbox.addTool(new ShapeComposeTool());
	toolbox.addTool(new BucketFillTool());
	toolbox.addTool(new PenTool());

	background(255);
}

function draw() {
	// call the draw function from the selected tool.
	if (toolbox.selectedTool.hasOwnProperty("draw")) {
		toolbox.selectedTool.draw();
	} 

	// Updating mouse coordinates in the status bar
	if (statusBar.areMouseCoordsShown()) {
		statusBar.updateStatusText();
	}

	// Draw the mouse icon if
	// tool has mouse icon url
	if (toolbox.selectedTool.hasOwnProperty("mouseIconUrl")) {
		mouseIconController.draw();
	}
}

// =======================================
// Pass on the events to the selected tool
// =======================================

function mousePressed() {
	if (toolbox.selectedTool.hasOwnProperty("mousePressed")) {
		toolbox.selectedTool.mousePressed(mouseX, mouseY);
	}
}

function mouseDragged() {
	if (toolbox.selectedTool.hasOwnProperty("mouseDragged")) {
		toolbox.selectedTool.mouseDragged(mouseX, mouseY);
	}
}

function mouseReleased() {
	if (toolbox.selectedTool.hasOwnProperty("mouseReleased")) {
		toolbox.selectedTool.mouseReleased(mouseX, mouseY);
	}
}

function keyTyped() {
	if (toolbox.selectedTool.hasOwnProperty("keyTyped")) {
		toolbox.selectedTool.keyTyped(key);
	}
}

function keyPressed() {
	if (toolbox.selectedTool.hasOwnProperty("keyPressed")) {
		toolbox.selectedTool.keyPressed(keyCode);
	}
}