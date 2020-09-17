  // Save canvas state as JSON on save click 
  document.getElementById("saveCanvasButton").addEventListener('click', () => {
    // Download function
    // Function taken from: https://stackoverflow.com/questions/34156282/how-do-i-save-json-to-local-text-file
    function download(content, fileName, contentType) {
      var a = document.createElement("a");
      content = JSON.stringify(content);
      var file = new Blob([content], { type: contentType });
      a.href = URL.createObjectURL(file);
      a.download = fileName;
      a.click();
      a.remove();
    }

    // Load to the pixels array
    loadPixels();

    // Download array as JSON
    download({ pixels: Array.from(pixels) }, 'canvas_state.json', 'text/plain');
  });

  // Load canvas state from json file
  document.getElementById("loadCanvasButton").addEventListener("click", () => {
    // File from the file input
    let file = document.getElementById('canvasStateFile').files[0];

    // If no file is selected
    if (!file) {
      alert("Please select a (json) file");
      return;
    }

    // Create new file reader object 
    let reader = new FileReader();

    // Event triggered when file has been loaded
    reader.onload = function (evt) {
      // Parse the JSON
      let loadedArray = JSON.parse(evt.target.result)["pixels"];

      // Create a Uint8 Array
      let loadedPixels = new Uint8ClampedArray(loadedArray);

      // Update the pixels array
      for (let i = 0; i < pixels.length; i++) {
        pixels[i] = loadedPixels[i];
      }

      // Update the canvas pixels
      updatePixels();
    };

    // Read the selected file
    reader.readAsText(file);
  });
