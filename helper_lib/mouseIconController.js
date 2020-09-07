/* -------- 
CONSTRUCTOR FUNCTION FOR MOUSE ICON CONTROLLER
--------- */
function MouseIconController() {
    let icon = null;
    const offsetLeft = canvas.position().x;
    const offsetTop = canvas.position().y;

    
    this.draw = function() {
        if (icon) {
            // Draw bucket icon if defined
            if (mouseInsideCanvas(canvas)) {
                icon.show();
                // Update mouse location
                updateMouseIconLocation();
            } else {
                // Hide icon if mouse not inside canvas
                icon.hide();
            }
        }
    };

    this.setIcon = function(iconUrl) {
        // Remove any previous icon
        if (icon) {
            icon.remove();
        }

        icon = createImg(iconUrl, "Mouse Icon");
        icon.addClass("mouseIcon");
        
        // Append mouse icon to DOM
        select(".options").child(icon);
    };

    // Private members
    const updateMouseIconLocation = () => {
        // Calculate new mouse location
        // Take offset and scroll into account
        let newX = mouseX + offsetLeft - (30 / 2) - scrollX;
        let newY = mouseY + offsetTop - (30 / 2) - scrollY;

        // Update icon style
        icon.style("left", `${newX}px`);
        icon.style("top", `${newY}px`);
    }
}