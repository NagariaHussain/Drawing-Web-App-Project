//  CONVERTED FROM TYPESCRIPT TO JS 
//  BABELJS WAS USED FOR CONVERSION
//  FLOOD FILL: https://pavelkukov.github.io/q-floodfill/
//  Inspired by: https://www.codeproject.com/Articles/6017/QuickFill-An-Efficient-Flood-Fill-Algorithm

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function colorToRGBA(color) {
    if (color.indexOf('rgba') !== -1) {
        var _$exec = /rgba\(.*?([0-9]{1,3}).*?([0-9]{1,3}).*?([0-9]{1,3}).*?([0-9\.]{1,})/g.exec(color),
            _$exec2 = _slicedToArray(_$exec, 5),
            _ = _$exec2[0],
            r = _$exec2[1],
            g = _$exec2[2],
            b = _$exec2[3],
            a = _$exec2[4];

        return {
            r: parseInt(r),
            g: parseInt(g),
            b: parseInt(b),
            a: Math.ceil(parseFloat(a) * 255)
        };
    } else if (color.indexOf('rgb') !== -1) {
        var _$exec3 = /rgb\(.*?([0-9]{1,3}).*?([0-9]{1,3}).*?([0-9]{1,3})/g.exec(color),
            _$exec4 = _slicedToArray(_$exec3, 4),
            _2 = _$exec4[0],
            _r = _$exec4[1],
            _g = _$exec4[2],
            _b = _$exec4[3];

        return {
            r: parseInt(_r),
            g: parseInt(_g),
            b: parseInt(_b),
            a: 255
        };
    } else if (color.indexOf('#') !== -1) {
        return hex2RGBA(color);
    } else {
        throw new Error('Unsupported color format. Please use CSS rgba, rgb, or HEX!');
    }
}

function isSameColor(a, b) {
    var tolerance = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
    return !(Math.abs(a.r - b.r) > tolerance || Math.abs(a.g - b.g) > tolerance || Math.abs(a.b - b.b) > tolerance || Math.abs(a.a - b.a) > tolerance);
}

function setColorAtPixel(imageData, color, x, y) {
    let width = imageData.width,
        data = imageData.data;

    let startPos = 4 * (y * width + x);

    // console.log("Start pos ", startPos)

    if (data[startPos + 3] === undefined) {
        throw new Error('Invalid pixel coordinates. Cannot set color at: x=' + x + '; y=' + y);
    }

    data[startPos + 0] = color.r & 0xff;
    data[startPos + 1] = color.g & 0xff;
    data[startPos + 2] = color.b & 0xff;
    data[startPos + 3] = color.a & 0xff;
}


function getColorAtPixel(imageData, x, y) {

    let width = imageData.width,
        data = imageData.data;

    var startPos = 4 * (y * width + x);
    // console.log(data);
    if (data[startPos + 3] === undefined) {
        throw new Error('Invalid pixel coordinates: x=' + x + '; y=' + y);
    }

    return {
        r: data[startPos],
        g: data[startPos + 1],
        b: data[startPos + 2],
        a: data[startPos + 3]
    };
}

function hex2RGBA(hex) {
    var alpha = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 255;
    var parsedHex = hex;

    if (hex.indexOf('#') === 0) {
        parsedHex = hex.slice(1);
    } // convert 3-digit hex to 6-digits.


    if (parsedHex.length === 3) {
        parsedHex = parsedHex[0] + parsedHex[0] + parsedHex[1] + parsedHex[1] + parsedHex[2] + parsedHex[2];
    }

    if (parsedHex.length !== 6) {
        throw new Error("Invalid HEX color ".concat(parsedHex, "."));
    }

    var r = parseInt(parsedHex.slice(0, 2), 16);
    var g = parseInt(parsedHex.slice(2, 4), 16);
    var b = parseInt(parsedHex.slice(4, 6), 16);
    return {
        r: r,
        g: g,
        b: b,
        a: alpha
    };
}

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _colorUtils = {
    colorToRGBA: colorToRGBA,
    getColorAtPixel: getColorAtPixel,
    isSameColor: isSameColor,
    setColorAtPixel: setColorAtPixel
};

class FloodFill {
    constructor(imageData) {
        _defineProperty(this, "collectModifiedPixels", false);

        _defineProperty(this, "modifiedPixelsCount", 0);

        _defineProperty(this, "modifiedPixels", new Set());

        _defineProperty(this, "_tolerance", 0);

        _defineProperty(this, "_queue", []);

        this.imageData = imageData;
    }
    /**
     * color should be in CSS format - rgba, rgb, or HEX
     */


    fill(color, x, y, tolerance) {
        this._newColor = (0, _colorUtils.colorToRGBA)(color);
        this._replacedColor = (0, _colorUtils.getColorAtPixel)(this.imageData, x, y);
        this._tolerance = tolerance;

        if ((0, _colorUtils.isSameColor)(this._replacedColor, this._newColor, this._tolerance)) {
            return;
        }

        this.addToQueue([x, x, y, -1]);
        this.fillQueue();
    }

    addToQueue(line) {
        this._queue.push(line);
    }

    popFromQueue() {
        if (!this._queue.length) {
            return null;
        }

        return this._queue.pop();
    }

    isValidTarget(pixel) {
        if (pixel === null) {
            return;
        }

        const pixelColor = (0, _colorUtils.getColorAtPixel)(this.imageData, pixel.x, pixel.y);
        return (0, _colorUtils.isSameColor)(this._replacedColor, pixelColor, this._tolerance);
    }

    fillLineAt(x, y) {
        if (!this.isValidTarget({
            x,
            y
        })) {
            return [-1, -1];
        }

        this.setPixelColor(this._newColor, {
            x,
            y
        });
        let minX = x;
        let maxX = x;
        let px = this.getPixelNeighbour('left', minX, y);

        while (px && this.isValidTarget(px)) {
            this.setPixelColor(this._newColor, px);
            minX = px.x;
            px = this.getPixelNeighbour('left', minX, y);
        }

        px = this.getPixelNeighbour('right', maxX, y);

        while (px && this.isValidTarget(px)) {
            this.setPixelColor(this._newColor, px);
            maxX = px.x;
            px = this.getPixelNeighbour('right', maxX, y);
        }

        return [minX, maxX];
    }

    fillQueue() {
        let line = this.popFromQueue();

        while (line) {
            const [start, end, y, parentY] = line;
            let currX = start;

            while (currX !== -1 && currX <= end) {
                const [lineStart, lineEnd] = this.fillLineAt(currX, y);

                if (lineStart !== -1) {
                    if (lineStart >= start && lineEnd <= end && parentY !== -1) {
                        if (parentY < y && y + 1 < this.imageData.height) {
                            this.addToQueue([lineStart, lineEnd, y + 1, y]);
                        }

                        if (parentY > y && y > 0) {
                            this.addToQueue([lineStart, lineEnd, y - 1, y]);
                        }
                    } else {
                        if (y > 0) {
                            this.addToQueue([lineStart, lineEnd, y - 1, y]);
                        }

                        if (y + 1 < this.imageData.height) {
                            this.addToQueue([lineStart, lineEnd, y + 1, y]);
                        }
                    }
                }

                if (lineEnd === -1 && currX <= end) {
                    currX += 1;
                } else {
                    currX = lineEnd + 1;
                }
            }

            line = this.popFromQueue();
        }
    }

    setPixelColor(color, pixel) {
        (0, _colorUtils.setColorAtPixel)(this.imageData, color, pixel.x, pixel.y);
        this.modifiedPixelsCount++;
        this.collectModifiedPixels && this.modifiedPixels.add(`${pixel.x}|${pixel.y}`);
    }

    getPixelNeighbour(direction, x, y) {
        x = x | 0;
        y = y | 0;
        let coords;

        switch (direction) {
            case 'right':
                coords = {
                    x: x + 1 | 0,
                    y
                };
                break;

            case 'left':
                coords = {
                    x: x - 1 | 0,
                    y
                };
                break;
        }

        if (coords.x >= 0 && coords.x < this.imageData.width) {
            return coords;
        }

        return null;
    }

}
