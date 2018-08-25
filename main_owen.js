const speedX = 0.15;
const speedY = 0.15;
var body = document.body,
    html = document.documentElement;

var height = Math.max( body.scrollHeight, body.offsetHeight, 
                       html.clientHeight, html.scrollHeight, html.offsetHeight );
const window_width = document.body.scrollWidth;
const window_height = height;
const rect_width_scale = 2;

var pxScale = 1;

var posX = 1 * pxScale;
var posY = 0.5;
var bgColour = [255, 255, 255];
var value = "";
var isMoveAllowed = false;
var vector_length = 31;
var probability_vector;
var param_data = null;

fetch(
    'http://localhost:5000/'
).then(function(response){
    return response.json();
}).then(function(data){
    console.log(data);
    param_data = data;
}).catch(function(error){
    console.log(error);
});

// The statements in the setup() function 
// execute once when the program begins
function setup() {
    // createCanvas must be the first statement
    createCanvas(window_width, window_height);  
    stroke(0);     // Set line drawing color to white
    fill(0)
    frameRate(40);
    textSize(20);
    
    /*probability_vector = [];
    var sum = 0;
    for (var i = 0; i < vector_length; i++) {
        probability_vector[i] = random();
        sum += probability_vector[i];
    }
    for (var i = 0; i < vector_length; i++) {
        probability_vector[i] /= sum;
    }*/
}

function drawMarker() {
    line(window_width / 2, 0, window_width / 2, window_height);
    line(window_width / 2 - 20, window_height / 2,
        window_width / 2 + 20, window_height / 2);
}

function drawValue(v) {
    fill(0);
    stroke(255);
    textAlign(CENTER, CENTER);
    text(v, width/4, height/2);
}

function getChars() {
    return 'abcdefghijklmnopqrstuvwxyz .\'-'.split('');
}

var chars = getChars();

function getProb(prevString) {
    if (param_data == null) return [];
    console.log(prevString + "\n");

    var ret = [];
    for (var i = 0; i < chars.length; i++)
        ret.push(0);
    if (prevString === "") {
        prevString = " ";
    }
    var threshold = 100.0;
    var lastChar = prevString[prevString.length - 1];
    var d = param_data[lastChar];
    prevString = prevString.substring(0, prevString.length - 1);
    lastChar = prevString[prevString.length - 1];
    while (prevString != "" &&
            lastChar in d['children'] &&
            d['sum_priority'] > threshold &&
            d['children'][lastChar]['children'] != null &&
            d['children'][lastChar]['children'] != {}) {
        d = d['children'][lastChar];
        prevString = prevString.substring(0, prevString.length - 1);
        lastChar = prevString[prevString.length - 1];
    }
    for (var i = 0; i < chars.length; i++)
        ret[i] = d['sum_priority'] / 100.0;
    for (var i = 0; i < chars.length; i++) {
        if (chars[i] in d['priority']) {
            ret[i] += d['priority'][chars[i]];
        }
    }
    var sum = 0;
    for (var i = 0; i < chars.length; i++)
        sum += ret[i];
    for (var i = 0; i < chars.length; i++)
        ret[i] /= sum;
    return ret;
    //return [0.1, 0.4, 0.05, 0.2, 0.25];
}

/*function getProb(prevString) {
    return probability_vector;
}*/

function getColours(chs) {
    var ret = [];
    for (var i = 0; i < chs.length; i++) {
        ret.push([
            Math.round(Math.random() * 360), // [0, 360]
            Math.round(Math.random() * 56 + 42), // [42, 98]
            Math.round(Math.random() * 40 + 130)]); // [40, 90]
    }
    return ret;
}

var cols = getColours(chars);

function drawRect(lowerCoord, upperCoord, ch, cl, listOfIntersecting) {
    if (upperCoord < 0 || lowerCoord > window_height) return;

    var sz = upperCoord - lowerCoord;
    colorMode(HSL, 360, 255, 255);
    print(cl[0], cl[1], cl[2]);
    const c = color(cl[0], cl[1], cl[2]);
    fill(c);
    noStroke()
    rect(width - rect_width_scale*sz, lowerCoord, rect_width_scale*sz, sz);
    stroke(0);
    if (width - rect_width_scale*sz < window_width / 2 && 
        lowerCoord < window_height / 2 &&
        window_height / 2 < lowerCoord + sz) {
        listOfIntersecting.push([ch, lowerCoord, upperCoord, cl]);
    }
    if (sz > 20) {
        fill(255);
        textAlign(CENTER, CENTER);
        if (ch == ' ') 
            ch = '_';
        text(ch, window_width - 3*rect_width_scale*sz/4, 
            (upperCoord + lowerCoord) / 2);
    }
}

var threshold = 0

function drawBox(lowerCoord, upperCoord, txt, listOfIntersecting) {
    if (upperCoord < 0 || lowerCoord > window_height) return;
    var height = upperCoord - lowerCoord;
    if (height < 100 || isNaN(height)) return;
    console.log(height);
    var ps = getProb(txt);
    var prev = 0;
    for (var i = 0; i < ps.length; i++) {
        var lc = lowerCoord + prev; // new lower coordinate
        var ln = ps[i] * height; // length
        if (lc <= -threshold && lc + ln >= window_height + threshold)
            ret = [lc, lc + ln, i];
        drawRect(lc, lc + ln, chars[i], cols[i], listOfIntersecting);
        // compute nested list and recurse
        drawBox(lc, lc + ln, txt + chars[i], listOfIntersecting);
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
        posY += normYDiff * speedY * posX / pxScale;
    }

    posX = max(posX, 0.0000000000001);
    posX = min(posX, 1);
    posY = max(posY, 0);
    posY = min(posY, 1);

    var intersecting = [];
    drawBox(
        window_height*(-posY*(pxScale-posX)/posX),
        window_height*(1+((1-posY)*(pxScale-posX)/posX)), 
        value, intersecting);

    fill(0);
    ellipse(window_width / 2, window_height / 2, 15, 15);
    line(window_width / 2, window_height / 2, mouseX, mouseY);
    
    if (intersecting.length > 3) {
        // move to new
        value += intersecting[0][0];
        bgColour = intersecting[0][3];
        var lb = intersecting[0][1];
        var ub = intersecting[0][2];
        posX = window_height / (ub - lb) * pxScale;
        posY = -lb * posX / window_height / (pxScale - posX);
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