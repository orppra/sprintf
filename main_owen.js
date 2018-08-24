
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
    frameRate(60);
}

function getProb(prevString) {
    return [0.1, 0.4, 0.05, 0.2, 0.25];
}

function getChars() {
    return ['a', 'b', 'c', 'd', 'e'];
}

var chars = getChars();

function drawRect(lowerCoord, upperCoord) {
    var sz = upperCoord - lowerCoord;
    rect(width - sz, lowerCoord, sz, sz);
}

function drawBox(lowerCoord, upperCoord, ps) {
    var height = upperCoord - lowerCoord;
    if (height < 50) return null;
    var ret = null;
    var prev = 0;
    for (var i = 0; i < ps.length; i++) {
        var lc = lowerCoord + prev; // new lower coordinate
        var ln = ps[i] * height; // length
        if (lc <= 0 && lc + ln >= window_height)
            ret = [lc, lc + ln, i];
        drawRect(lc, lc + ln);
        // compute nested list and recurse
        drawBox(lc, lc + ln, getProb());
        prev += ln;
    }
    return ret;
}

// The statements in draw() are executed until the 
// program is stopped. Each statement is executed in 
// sequence and after the last line is read, the first 
// line is executed again.
function draw() {
    
    background(0);   // Set the background to black
    fill(102);
    
    var normXDiff = 2 * mouseX / window_width - 1;
    var normYDiff = 2 * mouseY / window_height - 1;
    var midY = window_height / 2;
    
    posX -= normXDiff * speed * posX * posX;
    posY += normYDiff * speed;

    posX = max(posX, 0.01);
    posX = min(posX, 1);
    posY = max(posY, 0);
    posY = min(posY, 1);

    console.log(posX, posY);
    var ps = getProb(); // probabilities
    var ret = drawBox(
        window_height*(-posY*(1-posX)/posX),
        window_height*(1+((1-posY)*(1-posX)/posX)), 
        ps);

    if (ret != null) {
        console.log(chars[ret[2]]);
        // compute posX and posY from upper and lower bounds

    }

    ellipse(window_width / 2, window_height / 2, 15, 15);
    line(window_width / 2, window_height / 2, mouseX, mouseY);
}