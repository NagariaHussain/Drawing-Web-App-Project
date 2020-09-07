// Image Object Factory
function CreateImage(data, x, y, h, w) {
    return {
        data,
        x,
        y,
        width: w,
        height: h
    };
}