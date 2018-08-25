var y = 100;
const speed = 0.1;
const width = 500;
const height = 500;
var move = false;
var zoom = 1;
var posY = 0.5;
var p_s;
var p_s2;

// The statements in the setup() function 
// execute once when the program begins
function setup() {
	// createCanvas must be the first statement
    createCanvas(width, height);  
    stroke(255);     // Set line drawing color to white
    frameRate(60);
    p_s = [];
    p_s2 = [];
    var sum = 0;
    for (var i = 0; i < 26; i++) {
        p_s[i] = random();
        sum += p_s[i];

        var sum2 = 0;
        p_s2[i] = [];
        for (var j = 0; j < 26; j++) {
            p_s2[i][j] = random();
            sum2 += p_s2[i][j];
        }

        for (var j = 0; j < 26; j++) {
            p_s2[i][j] /= sum2;
        }
    }

    for (var i = 0; i < 26; i++) {
        p_s[i] /= sum;
    }
}

// The statements in draw() are executed until the 
// program is stopped. Each statement is executed in 
// sequence and after the last line is read, the first 
// line is executed again.
function draw() {
    background(0);   // Set the background to black

    
    var prev = 0;


    fill(102);
    ellipse(width/2, height/2, 15, 15);

    line(width/2, height/2, mouseX, mouseY);
    var normXDiff = 2 * mouseX/width - 1;
    var normYDiff = 2 * mouseY/height - 1;


    // we obtain values from -1 to 1
    // transX += normXDiff * width/10;

    if (move) {
        zoom += normXDiff * speed;
        posY += normYDiff * speed / zoom;
    }

    posY = max(posY, 0);
    posY = min(posY, 1);

    zoom = max(0.7, zoom);

    for (var i = 0; i < p_s.length; i++) {
        var p = p_s[i];
        var size = p * height;

        var y = prev * height;

        y *= zoom;

        if (zoom >= 1) {
            y -= posY * height * (zoom-1);
        } else
            y -= 0.5 * height * (zoom-1);
        size *= zoom;
        fill(102);
        var x = width-size;
        rect(x, y, size, size);
        prev += p;
    }
}

function transposeCoordinates(x1, y1, x2, y2, p1, p2, q1, q2, parent_weight) {
    var relativeZoom = zoom*parent_weight;
    // this is the zoom level of the parent box relative to the viewport
    // it should be 1 if the parent box fills the screen exactly


}

function mousePressed() {
    move = !move;
}