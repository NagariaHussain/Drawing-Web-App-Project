function SprayCanTool(){
	this.name = "SprayCan";
	this.icon = "assets/icons/sprayer.png";

	var points = 13;
	var spread = 10;

	this.draw = function(){
		var r = random(5,10);
		if(mouseIsPressed){
			for(var i = 0; i < points; i++){
				point(random(mouseX-spread, mouseX + spread), random(mouseY-spread, mouseY+spread));
			}
		}
	};
}