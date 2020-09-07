// GENERIC HELPERS
function mouseInsideCanvas(canvas) {
    return (
        mouseX > canvas.elt.offsetLeft &&
        mouseX < (canvas.elt.offsetLeft + canvas.width) &&
        mouseY > canvas.elt.offsetTop &&
        mouseY < (canvas.elt.offsetTop + canvas.height)
    );
}

// =====================================
// HELPERS TO HANDLE STACK DATA STRUCTURE
// =====================================

// Function to push given `element` to `stack`
function pushToStack(stack, element) {
    stack.push(element);
}

// Pop the `top` of the stack and return it
function popStack(stack) {
    return stack.pop();
}

// Returns `true` if stack is empty
function isStackEmpty(stack) {
    return (stack.length === 0);
}
