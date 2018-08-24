const speed = 0.1;
const window_width = 500;
const window_height = 500;
var posX = 1;
var posY = 0.5;
var zoom = 1;

// The statements in the setup() function 
// execute once when the program begins
function setup() {
	// createCanvas must be the first statement
    createCanvas(window_width, window_height);  
    stroke(255);     // Set line drawing color to white
    frameRate(30);
}

function drawRect(lowerCoord, upperCoord) {
    var sz = upperCoord - lowerCoord;
    rect(width - sz, lowerCoord, sz, sz);
}

function drawBox(lowerCoord, upperCoord, ps) {
    var ht = upperCoord - lowerCoord;
    var prev = 0;
    for (var i = 0; i < ps.length; i++) {
        drawRect(lowerCoord + prev, lowerCoord + prev + ps[i] * ht);
        prev += ps[i] * ht;
    }
}

// The statements in draw() are executed until the 
// program is stopped. Each statement is executed in 
// sequence and after the last line is read, the first 
// line is executed again.
function draw() {
    
    background(0);   // Set the background to black
    var p_s = [0.3, 0.1, 0.2, 0.4];
    fill(102);
    
    ellipse(window_width/2, window_height/2, 15, 15);
    line(window_width / 2, window_height / 2, mouseX, mouseY);
    var normXDiff = 2 * mouseX / window_width - 1;
    var normYDiff = 2 * mouseY / window_height - 1;
    var midY = window_height / 2;
    
    posX -= normXDiff * speed * posX * posX;
    posY += normYDiff * speed;

    posX = max(posX, 0.1);
    posX = min(posX, 1);
    posY = max(posY, 0);//posX/2);
    posY = min(posY, 1);//1-posX/2);

    console.log(posX, posY);

    drawBox(midY - (posY*(1-posX)+posX/2)*(window_height/posX),
            midY + ((1-posY)*(1-posX)+posX/2)*(window_height/posX), 
            p_s);

}