// =====================================
// SHAPE MODELS ========================
// =====================================

class Rectangle {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }

    draw() {
        rect(this.x, this.y, this.w, this.h);
    }

    // Get the coordinates of the vertices in GeoJSON format
    getVertices() {
        return [[
            [this.x, this.y],
            [this.x + this.w, this.y],
            [this.x + this.w, this.y + this.h],
            [this.x, this.y + this.h]
        ]];
    }

    // Is the shape drawable
    isValid() {
        return (this.w > 0 && this.h > 0);
    }

    static fromCoordinatePairs(sx, sy, mx, my) {
        return new Rectangle(
            sx,
            sy,
            mx - sx,
            my - sy
        );
    }

    // Square as a special case of rectangle
    static Square(sx, sy, mx, my) {
        let side = dist(
            sx,
            sy,
            mx,
            my) / Math.SQRT2;

        return new Rectangle(
            sx,
            sy,
            side * ((mx - sx) / Math.abs(mx - sx)),
            side * ((my - sy) / Math.abs(my - sy))
        );
    }
}

class Circle {
    constructor(x, y, r) {
        this.x = x;
        this.y = y;
        this.r = r;
    }

    draw() {
        ellipse(this.x, this.y, this.r * 2);
    }

    // Get the coordinates of the vertices in GeoJSON format
    getVertices() {
        let angle = TWO_PI / 100;
        const vertices = [[]];
        for (let a = 0; a < TWO_PI; a += angle) {
            let sx = this.x + cos(a) * this.r;
            let sy = this.y + sin(a) * this.r;
            vertices[0].push([sx, sy]);
        }
        return vertices;
    }

    // Is the shape drawable
    isValid() {
        return this.r > 0;
    }

    static fromCoordinatePairs(sx, sy, mx, my) {
        const radius = dist(sx, sy, mx, my);
        return new Circle(sx, sy, radius);
    }
}

class Ellipse {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }

    draw() {
        ellipseMode(CENTER);
        ellipse(this.x, this.y, this.w, this.h);
    }

    // get the coordinates of the shape in GeoJSON Format
    getVertices() {
        let angle = TWO_PI / 100;
        const vertices = [[]];
        
        for (let a = 0; a < TWO_PI; a += angle) {
            let sx = this.x + cos(a) * this.w / 2;
            let sy = this.y + sin(a) * this.h / 2;
            vertices[0].push([sx, sy]);
        }
        
        return vertices;
    }

    // Is this shape drawable?
    isValid() {
        return (this.w > 0 && this.h > 0);
    }

    static fromCoordinatePairs(sx, sy, mx, my) {
        return new Ellipse(sx, sy, 2 * (mx - sx), 2 * (my - sy));
    }
}

class RegularPolygon {
    constructor(x, y, radius, numSides) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.numSides = numSides || 3;
    }

    // TAKEN FROM p5js Official Examples
    draw() {
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
    getVertices() {
        const vertices = [[]];
        let angle = TWO_PI / this.numSides;
        for (let a = 0; a < TWO_PI; a += angle) {
            let sx = this.x + cos(a) * this.radius;
            let sy = this.y + sin(a) * this.radius;
            vertices[0].push([sx, sy]);
        }
        return vertices;
    }

    static fromCoordinatePairs(sx, sy, mx, n) {
        return new RegularPolygon(sx, sy, mx - sx, n);
    }
}

class Star {
    constructor(x, y, radius1, radius2, npoints) {
        this.x = x;
        this.y = y;
        this.radius1 = radius1;
        this.radius2 = radius2;
        this.npoints = npoints;
    }

    // TAKEN FROM p5js Official Examples
    draw() {
        let angle = TWO_PI / this.npoints;
        let halfAngle = angle / 2.0;
        beginShape();
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
        return this.radius1 > 0 && this.radius2 > 0;
    }

    // Get the coordinates of the vertices in GeoJSON format
    getVertices() {
        const vertices = [[]];
        let angle = TWO_PI / this.npoints;
        let halfAngle = angle / 2.0;

        for (let a = 0; a < TWO_PI; a += angle) {
            let sx = this.x + cos(a) * this.radius2;
            let sy = this.y + sin(a) * this.radius2;
            vertices[0].push([sx, sy]);
            sx = this.x + cos(a + halfAngle) * this.radius1;
            sy = this.y + sin(a + halfAngle) * this.radius1;
            vertices[0].push([sx, sy]);
        }
        return vertices;
    }

    static fromCoordinatePairs(sx, sy, mx, n) {
        return new Star(sx, sy, mx - sx, 70, n);
    }
}

