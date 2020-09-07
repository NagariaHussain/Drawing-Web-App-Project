// ====================
// StatusBar Object's Class
// ====================

class StatusBar {
    // Initial Setup
    constructor() {
        // Public props
        this.text = '';
        this.showingMouseCoord = true;
        
        // Initial Status Bar DOM setup
        this.textElement = document.getElementById("statusBar");
        this.textElement.innerText = this.text;
    }

    // Change the text for some `duration` ms
    setTempText(text, duration) {
        // Set the text
        this.setText(text);

        // Reset back to mouse coordinates after `duration` milliseconds
        setTimeout(() => {
            // Update the text
            this.showingMouseCoord = true;
            this.updateStatusText();
        }, duration);
    }

    // Change the text state and update the DOM
    setText(text) {
        // Update the internal text state
        this.text = text;
        this.showingMouseCoord = false;
        this.updateStatusText();
    }

    // Method to update the innerText of the DOM Element
    updateStatusText() {
        if (this.showingMouseCoord) {
            // If mouse coordinates are shown
            this.textElement.innerText = this.getFormatedMouseCoords();
        } else {
            // If some other text is to be shown
            this.textElement.innerText =  this.text;
        }
    }

    // Returns the formatted mouse coordinates as string
    getFormatedMouseCoords() {
        // Rounding off
        let mx = Math.floor(mouseX);
        let my = Math.floor(mouseY);

        // Only coordinates inside the canvas
        mx = constrain(mx, 0, width);
        my = constrain(my, 0, height);

        // return formatted string
        return `x: ${mx},  y: ${my}`;
    }

    // Get the boolean showingMouseCoord
    areMouseCoordsShown() {
        return this.showingMouseCoord;
    }

}