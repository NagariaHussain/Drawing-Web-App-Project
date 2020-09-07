// Displays and handles the colour palette.
// Also, creates a color picker and listens for changes

function ColourPalette() {
	//a list of web colour strings
	this.colours = ["black", "silver", "gray", "white", "maroon", "red", "purple",
		"orange", "pink", "fuchsia", "green", "lime", "olive", "yellow", "navy",
		"blue", "teal"
	];

	//make the start colour be black
	this.selectedColour = "black";

	// Keeping track of current fill color
	fillColor = "black";

	var self = this;

	var colourClick = function () {
		// Remove the old border from selected color
		var current = select("#" + self.selectedColour + "Swatch");
		current.style("border", "0");

		// Remove border from color Picker
		select("#colorPicker").style("border", "0");

		// Get the new colour from the id of the clicked element
		var c = this.id().split("Swatch")[0];

		// Set the selected colour and fill and stroke
		self.selectedColour = c;
		// Keeping track of current fill color
		fillColor = c;
		fill(c);
		stroke(c);

		// Add a new border to the selected colour
		this.style("border", "2px dashed salmon");
	}

	// load in the colours
	this.loadColours = function () {
		// Set the fill and stroke properties to be black at the start of the program
		// running
		fillColor = this.colours[0];
		fill(this.colours[0]);
		stroke(this.colours[0]);

		// For each colour create a new div in the html for the colourSwatches
		for (var i = 0; i < this.colours.length; i++) {
			var colourID = this.colours[i] + "Swatch";

			// Add the swatch to the palette and set its background colour
			// to be the colour value.
			var colourSwatch = createDiv();
			colourSwatch.class('colourSwatches');
			colourSwatch.id(colourID);

			select(".colourPalette").child(colourSwatch);
			select("#" + colourID).style("background-color", this.colours[i]);
			colourSwatch.mouseClicked(colourClick);
		}

		// Highlight the selected colour
		select(".colourSwatches").style("border", "2px dashed salmon");

		// Load color input
		loadColorPicker();
	};

	// To load color picker HTML Element
	function loadColorPicker() {
		// Color Palette container
		const container = document.querySelector(".colourPalette");

		// Creating and initializing a color input
		const picker = document.createElement("input");
		picker.setAttribute("type", "color");
		picker.id = "colorPicker";
		picker.value = "#ff0000";
		picker.classList.add("colourSwatches");
		
		// Inserting color input to the DOM
		container.insertAdjacentElement("beforeend", picker);

		// Listening to changes and changing Fill and Stroke 
		picker.addEventListener("input", function() {
			// Set Fill and Stroke to selected (changed) value
			fill(picker.value);
			stroke(picker.value);

			// Tracking current fill color
			fillColor = picker.value;

			// Remove the old border
			var current = select("#" + self.selectedColour + "Swatch");
			current.style("border", "0");

			// Highlight color picker
			picker.style.border = "2px dashed salmon";
		});
	}

	//call the loadColours function now it is declared
	this.loadColours();
}