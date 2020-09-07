function FreehandTool(){
	//set an icon and a name for the object
	this.icon = "assets/icons/pencil.png";
	this.name = "FreeHand";

	//to smoothly draw we'll draw a line from the previous mouse location
	//to the current mouse location. The following values store
	//the locations from the last frame. They are -1 to start with because
	//we haven't started drawing yet.
	let previousMouseX = -1;
	let previousMouseY = -1;
	let brushWeight = 1;
	let brushWeightSilder;
	let sliderDesc;
	let currentWeightText;

	this.draw = function(){
		//if the mouse is pressed
		if(mouseIsPressed){
			//check if they previousX and Y are -1. set them to the current
			//mouse X and Y if they are.
			if (previousMouseX == -1){
				previousMouseX = mouseX;
				previousMouseY = mouseY;
			}
			//if we already have values for previousX and Y we can draw a line from 
			//there to the current mouse location
			else{			
				push();
				strokeWeight(brushWeight);
				line(previousMouseX, previousMouseY, mouseX, mouseY);
				pop();

				previousMouseX = mouseX;
				previousMouseY = mouseY;
			}
		}

		//if the user has released the mouse we want to set the previousMouse values 
		//back to -1.
		//try and comment out these lines and see what happens!
		else{
			previousMouseX = -1;
			previousMouseY = -1;
		}
	};

	this.populateOptions = function() {
		const menuSpace = select(".options");

		// Slider description text
		sliderDesc = createP("Brush Weight: ");
		sliderDesc.style("display", "inline-block");
		
		// Display current brush weight
		currentWeightText = createP(`${brushWeight.toFixed(1)}`);
		currentWeightText.style("display", "inline-block");

		// HTML Slider element
		brushWeightSilder = createSlider(0.5, 72, brushWeight, 0.10);
		brushWeightSilder.style("margin", "0 20px");

		// Appending the options to options area
		menuSpace.child(sliderDesc);
		menuSpace.child(brushWeightSilder);
		menuSpace.child(currentWeightText);

		// Listening to brush size change event
		brushWeightSilder.input((e) => {
			// Update the brush size
			brushWeight = Number(e.target.value);

			// Update the size display
			currentWeightText.html(`${brushWeight.toFixed(1)}`);
		});
	};

	this.unselectTool = function () {
		select(".options").html("");
	};
}