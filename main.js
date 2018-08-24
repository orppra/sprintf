var y = 100;
const speed = 0.1;
const width = 500;
const height = 500;
var posX = 0.5;
var posY = 0.5;

// The statements in the setup() function 
// execute once when the program begins
function setup() {
	// createCanvas must be the first statement
    createCanvas(width, height);  
    stroke(255);     // Set line drawing color to white
    frameRate(30);
}

// The statements in draw() are executed until the 
// program is stopped. Each statement is executed in 
// sequence and after the last line is read, the first 
// line is executed again.
function draw() {
    background(0);   // Set the background to black

    var p_s = [0.3, 0.1, 0.2, 0.4];
    var prev = 0;


    fill(102);
    ellipse(width/2, height/2, 15, 15);

    line(width/2, height/2, mouseX, mouseY);
    var normXDiff = 2 * mouseX/width - 1;
    var normYDiff = 2 * mouseY/height - 1;

    // we obtain values from -1 to 1
    // transX += normXDiff * width/10;

    
    posX += normXDiff * speed;
    posY += normYDiff * speed;

    posY = max(posY, 0);
    posY = min(posY, 1);

    for (var i = 0; i < p_s.length; i++) {
        var p = p_s[i];
        var size = p * height;

        var y = prev * height;

        var zoom = posX;

        // y *= zoom;
        // y -= posY * height;

        

        size *= zoom;
        fill(102);
        var x = width-size;
        rect(x, y, size, size);
        prev += p;
    }
}