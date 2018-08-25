
const speedX = 0.15;
const speedY = 0.15;
const window_width = document.body.scrollWidth;
var body = document.body,
    html = document.documentElement;

var height = Math.max( body.scrollHeight, body.offsetHeight, 
                       html.clientHeight, html.scrollHeight, html.offsetHeight );
const window_height = height;
const rect_width_scale = 3;

var canvas = document.body.getElementsByTagName("#c")[0];
var posX = 1;
var posY = 0.5;
var zoom = 1;
var bgColour = [0, 0, 0];
var value = "";
var isMoveAllowed = true;
var vector_length = 31;
var probability_vector;

fetch(
    'http://localhost:5000/'
).then(function(response){
    return response.json();
}).then(function(data){
    console.log(data);
}).catch(function(error){
    console.log(error);
});

// The statements in the setup() function 
// execute once when the program begins
function setup() {
    // createCanvas must be the first statement
    createCanvas(window_width, window_height);  
    stroke(255);     // Set line drawing color to white
    frameRate(60);
    textSize(20);
    
    probability_vector = [];
    var sum = 0;
    for (var i = 0; i < vector_length; i++) {
        probability_vector[i] = random();
        sum += probability_vector[i];
    }
    for (var i = 0; i < vector_length; i++) {
        probability_vector[i] /= sum;
    }
}

function drawMarker() {
    line(window_width / 2, 0, window_width / 2, window_height);
    line(window_width / 2 - 20, window_height / 2,
        window_width / 2 + 20, window_height / 2);
}

function drawValue(v) {
    fill(255)
    textAlign(CENTER, CENTER);
    text(v, width/4, height/2);
}

function getProb(prevString) {
    return probability_vector;
}

function getChars() {
    return 'abcdefghijklmnopqrstuvwxyz ,.\'"-'.split('');
}

var chars = getChars();

function getColours(chs) {
    var ret = [];
    for (var i = 0; i < chs.length; i++) {
        ret.push([
            Math.random() * 120,
            Math.random() * 120,
            Math.random() * 120]);
    }
    return ret;
}

var cols = getColours(chars);

function drawRect(lowerCoord, upperCoord, ch, cl, listOfIntersecting) {
    if (upperCoord < 0 || lowerCoord > window_height) return;

    var sz = upperCoord - lowerCoord;
    fill(cl[0], cl[1], cl[2]);
    rect(width - rect_width_scale*sz, lowerCoord, rect_width_scale*sz, sz);
    if (width - sz < window_width / 2 && 
        lowerCoord < window_height / 2 &&
        window_height / 2 < lowerCoord + sz) {
        listOfIntersecting.push([ch, lowerCoord, upperCoord, cl]);
    }
    if (sz > 20) {
        fill(255);
        textAlign(CENTER, CENTER);
        text(ch, window_width - sz + 10, 
            (upperCoord + lowerCoord) / 2);
    }
}

var threshold = 0

function drawBox(lowerCoord, upperCoord, ps, listOfIntersecting) {
    if (upperCoord < 0 || lowerCoord > window_height) return;

    var height = upperCoord - lowerCoord;
    if (height < 50) return;
    var prev = 0;
    for (var i = 0; i < ps.length; i++) {
        var lc = lowerCoord + prev; // new lower coordinate
        var ln = ps[i] * height; // length
        if (lc <= -threshold && lc + ln >= window_height + threshold)
            ret = [lc, lc + ln, i];
        drawRect(lc, lc + ln, chars[i], cols[i], listOfIntersecting);
        // compute nested list and recurse
        drawBox(lc, lc + ln, getProb(), listOfIntersecting);
        prev += ln;
    }
}

// The statements in draw() are executed until the 
// program is stopped. Each statement is executed in 
// sequence and after the last line is read, the first 
// line is executed again.
function draw() {
    background(bgColour[0], bgColour[1], bgColour[2]);
    
    var normXDiff = mouseX / window_width - 0.5;
    var normYDiff = mouseY / window_height - 0.5;
    var midY = window_height / 2;
    
    if (isMoveAllowed) {
        posX -= normXDiff * speedX * posX;
        posY += normYDiff * speedY * posX;
    }

    posX = max(posX, 0.00000001);
    posX = min(posX, 1);
    posY = max(posY, 0);
    posY = min(posY, 1);
    //console.log(posX, posY);

    var ps = getProb(); // probabilities
    var intersecting = [];
    drawBox(
        window_height*(-posY*(1-posX)/posX),
        window_height*(1+((1-posY)*(1-posX)/posX)), 
        ps, intersecting);

    ellipse(window_width / 2, window_height / 2, 15, 15);
    line(window_width / 2, window_height / 2, mouseX, mouseY);
    //console.log(value, intersecting.length);
    
    if (intersecting.length > 3) {
        // move to new
        value += intersecting[0][0];
        bgColour = intersecting[0][3];
        var lb = intersecting[0][1];
        var ub = intersecting[0][2];
        posX = window_height / (ub - lb);
        posY = -lb * posX / window_height / (1 - posX);
        intersecting.shift();
    }

    drawMarker();
    var value2 = value;
    for (var i = 0; i < intersecting.length; i++)
        value2 += intersecting[i][0];
    drawValue(value2);

    text(posX, 200, 100);
}


function mousePressed() {
    isMoveAllowed = !isMoveAllowed;
}