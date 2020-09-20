// =====================================
// SHAPE MODELS ========================
// Note: 
// The shape classes are used by the shapeTool 
// and the shapeComposeTool to handle drawing 
// and performing operations on available shapes.
// =====================================

// Rectangle Class
class Rectangle {
    // Contructor
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }

    // Draws this object to the canvas
    draw() {
        rect(this.x, this.y, this.w, this.h);
    }

    // Get the coordinates of the vertices in GeoJSON format
    // Used by the shape composition algorithm
    getVertices() {
        return [
            [
                [this.x, this.y],
                [this.x + this.w, this.y],
                [this.x + this.w, this.y + this.h],
                [this.x, this.y + this.h]
            ]
        ];
    }

    // Is the shape drawable
    isValid() {
        // Both width and height 
        // should be greater than 0
        return (this.w > 0 && this.h > 0);
    }

    // Static method to create a new rectangle 
    // using given coordinates
    static fromCoordinatePairs(sx, sy, mx, my) {
        // return an instance of rectangle class
        return new Rectangle(
            sx,
            sy,
            mx - sx,
            my - sy
        );
    }

    // Static method to create
    // Square as a special case of rectangle
    static Square(sx, sy, mx, my) {
        // Calculate the side of the square 
        // based on given parameters
        let side = dist(
            sx,
            sy,
            mx,
            my) / Math.SQRT2;

        // return an instance of rectangle class
        // with dimensions based on calculated side
        return new Rectangle(
            sx,
            sy,
            side * ((mx - sx) / Math.abs(mx - sx)),
            side * ((my - sy) / Math.abs(my - sy))
        );
    }
}

// Square Class
class Circle {
    // constructor 
    constructor(x, y, r) {
        this.x = x;
        this.y = y;
        this.r = r;
    }

    // Draw this shape to the canvas
    draw() {
        ellipse(this.x, this.y, this.r * 2);
    }

    // Get the coordinates of the vertices in "GeoJSON format"
    // Used by the shape composition algorithm
    // Vertex generation code inspired by p5js examples
    getVertices() {
        // Make 100 division of the full 2pi angle
        let angle = TWO_PI / 100;

        const vertices = [
            []
        ];

        // Generate the vertices
        for (let a = 0; a < TWO_PI; a += angle) {
            let sx = this.x + cos(a) * this.r;
            let sy = this.y + sin(a) * this.r;
            // Append the calculated coordinates 
            // to the vertices array
            vertices[0].push([sx, sy]);
        }

        // Return the vertices (GeoJSON format)
        return vertices;
    }

    // Is the shape drawable
    isValid() {
        // The radius should be greater than 0
        return this.r > 0;
    }

    // Static method to create a new instance of 
    // circle class based on supplied parameters
    static fromCoordinatePairs(sx, sy, mx, my) {
        // Calculate the radius
        const radius = dist(sx, sy, mx, my);
        // return an instance of Circle class
        return new Circle(sx, sy, radius);
    }
}

// Ellipse class
class Ellipse {
    // constructor
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }

    // To draw to the canvas
    draw() {
        ellipseMode(CENTER);
        ellipse(this.x, this.y, this.w, this.h);
    }

    // get the coordinates of the shape in GeoJSON Format
    // Used by the shape composition algorithm
    // Vertex generation code inspired by p5js examples
    getVertices() {
        let angle = TWO_PI / 100;
        const vertices = [
            []
        ];

        // Generate vertices
        for (let a = 0; a < TWO_PI; a += angle) {
            let sx = this.x + cos(a) * this.w / 2;
            let sy = this.y + sin(a) * this.h / 2;

            // Append the calculated coordinates 
            // to the vertices array
            vertices[0].push([sx, sy]);
        }

        // return the array of vertices in 
        // GeoJSON format
        return vertices;
    }

    // Is this shape drawable?
    isValid() {
        // Both width and height 
        // must be greater than 0
        return (this.w > 0 || this.h > 0);
    }

    // Returns an instance of Ellipse class
    static fromCoordinatePairs(sx, sy, mx, my) {
        return new Ellipse(sx, sy, 2 * (mx - sx), 2 * (my - sy));
    }
}

// Regular Polgon class
class RegularPolygon {
    // constructor
    constructor(x, y, radius, numSides) {
        this.x = x;
        this.y = y;
        this.radius = radius;

        // If numSides is not given, 
        // set it to 3
        this.numSides = numSides || 3;
    }

    // draw the polygon to the canvas
    draw() {
        // From the p5js (Official) Examples
        let angle = TWO_PI / this.numSides;
        beginShape();
        for (let a = 0; a < TWO_PI; a += angle) {
            let sx = this.x + cos(a) * this.radius;
            let sy = this.y + sin(a) * this.radius;
            vertex(sx, sy);
        }
        endShape(CLOSE);
    }

    // Is the shape drawable
    isValid() {
        return this.radius > 0;
    }

    // Get the coordinates of the vertices in GeoJSON format
    // Used by the shape composition algorithm
    getVertices() {
        const vertices = [
            []
        ];

        // Divide the total 2pi angle 
        // into numSides segments
        let angle = TWO_PI / this.numSides;
        
        // Generate vertices
        for (let a = 0; a < TWO_PI; a += angle) {
            let sx = this.x + cos(a) * this.radius;
            let sy = this.y + sin(a) * this.radius;
            // Append the (x, y) pair to the vertex array
            vertices[0].push([sx, sy]);
        }

        // return the vertices array 
        // in GeoJSON format
        return vertices;
    }

    // Returns an instance of RegularPolygon class
    // Property values calculated based on 
    // given parameters
    static fromCoordinatePairs(sx, sy, mx, n) {
        return new RegularPolygon(sx, sy, mx - sx, n);
    }
}

// Star class
class Star {
    // Constructor
    constructor(x, y, radius1, radius2, npoints) {
        this.x = x;
        this.y = y;
        this.radius1 = radius1;
        this.radius2 = radius2;
        this.npoints = npoints;
    }

    // Draw the star shape to the canvas
    draw() {
        // TAKEN FROM p5js Official Examples
        let angle = TWO_PI / this.npoints;
        let halfAngle = angle / 2.0;

        beginShape();
        
        // Draw the actual star shape
        for (let a = 0; a < TWO_PI; a += angle) {
            let sx = this.x + cos(a) * this.radius2;
            let sy = this.y + sin(a) * this.radius2;
            vertex(sx, sy);
            sx = this.x + cos(a + halfAngle) * this.radius1;
            sy = this.y + sin(a + halfAngle) * this.radius1;
            vertex(sx, sy);
        }
        endShape(CLOSE);
    }

    // Is the shape drawable
    isValid() {
        // Both the radii must 
        // be greater than 0
        return this.radius1 > 0 && this.radius2 > 0;
    }

    // Get the coordinates of the vertices in GeoJSON format
    // Used by the shape composition algorithm
    getVertices() {
        const vertices = [
            []
        ];
        let angle = TWO_PI / this.npoints;
        let halfAngle = angle / 2.0;

        // Generate vertices
        for (let a = 0; a < TWO_PI; a += angle) {
            let sx = this.x + cos(a) * this.radius2;
            let sy = this.y + sin(a) * this.radius2;
            // Append first pair to vertices array
            vertices[0].push([sx, sy]);

            sx = this.x + cos(a + halfAngle) * this.radius1;
            sy = this.y + sin(a + halfAngle) * this.radius1;
            // Append second pair to vertices array
            vertices[0].push([sx, sy]);
        }

        // Return the vertices array
        // in GeoJSON format
        return vertices;
    }

    // Returns an instance of the star class
    // with default radius2 to be 70
    static fromCoordinatePairs(sx, sy, mx, n) {
        return new Star(sx, sy, mx - sx, 70, n);
    }
}