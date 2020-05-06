// You Spin Me Right Round Baby, 2020
// Charlie Dean

// HERE ARE SOME VARIABLES
let imgs = [];
let imgCount = 452;
let ldrSize = 50;
let ldrPhase = 0;
let wheelSize; // Diameter of circle
var posX; // Center point of circle
var posY; // Center point of circle
var dx;
var dy;
let angle = 0;
let count = 0;
let offsetAngle = 0;
let mouseAngle;
let dragging = false;
let t = 0; // T will represent the frame number to display mapped to the number of rotations: 0deg = frame 0 and 1079deg = frame 1349
let degree; // ranges 0 to 359. Current rotation position of circle.
let degreeOld;
let rotCW; // true is clockwise and false is counterclockwise
let endDiff;
let coastDown;
let coastDownAmt;
let lastDeg = 0;
let rotPos;
let intro;
let deviceToolName = 'mouse';
let introBGOpacity = 100;
let introTextOpacity = 255;
let loaded;
let debug = false;
let maskCircle;

// PRELOADS ALL IMAGES IN SEQUENCE
function preload () {
  noCanvas();
  loaded = false;
  let loadFrameNum = 0;
  for (let i = 0; i < imgCount; i++) {
    loadFrameNum = nf(i, 3, 0);
    imgs.push(loadImage('data/loopboy'+loadFrameNum+'.jpg'));
  }


}

// CREATES HTML <CANVAS> TO DISPLAY IMAGES. RUNS ONCE AT PAGELOAD
function setup() {

  loaded = true;
  setMoveThreshold(0.01);
  var cnv = createCanvas(windowWidth, windowHeight);
  cnv.style('display', 'block');

  // POSITIONS THE WHEEL IN THE CENTER OF BROWSER WINDOW
  wheelSize = constrain(min(windowHeight, windowWidth), 0, 920) - 20;

  posX = windowWidth/2;
  posY = windowHeight/2;
  imageMode(CENTER);
  intro = true;

  ellipseMode(CENTER);
  maskCircle = ellipse(posX, posY, wheelSize);
}

function deviceMoved() {
  deviceToolName = 'finger';
}


// THIS CODE LOOPS
function draw() {
// BACKGROUND
  background(0);


  // IF DRAGGING, CALCULATE MOUSE ANGLE FROM CENTER POINT OF CIRCLE
  if (dragging) {
    dx = mouseX - posX;
    dy = -(mouseY - posY);
    mouseAngle =  atan2(dy, dx);
    angle = mouseAngle - offsetAngle;
  }
//angle= atan2(dy, dx) - atan2(dy, dx) + angle

if (angle > TWO_PI) {
  angle = angle - TWO_PI
} else if (angle < - TWO_PI) {
  angle = angle + TWO_PI;
}

  // THIS CODE MAKES THE angle VARIABLE MORE GOOD SOMEHOW
  var calcAngle = 0;
  if (angle < 0) {
    calcAngle = map(angle, -PI, 0, PI, 0);
  } else if (angle > 0) {
    calcAngle = map(angle, 0, PI, TWO_PI, PI);
  } if (angle == 0) {
    calcAngle = 0;
  }



  //STORES THE LAST LOOP'S DEGREE IN degreeOld, THEN GETS A NEW VALUE OF degree FROM calcAngle
  degreeOld = degree;
  degree = degrees(calcAngle);


  // DIRECTION OF ROTATION INDICATOR
  if (degreeOld < degree) {
    rotCW = true; //rotating clockwise
  } else if (degreeOld > degree) {
    rotCW = false; // rotating counterclockwise
  } if(floor(degreeOld) == 0 || floor(degree) == 0) {
    rotCW = rotCW;
  }


  //DISPLAY IMAGE CODE
  t = map(calcAngle, 0, TWO_PI, 0, imgCount-1);
  t = constrain(abs(floor(t)), 0, imgCount-1);

  if (t || !t) {
    image(imgs[t], posX, posY, wheelSize, wheelSize);
  }

  //COASTDOWN
  if (coastDown) {
    coastDownAmt = radians(endDiff)
    if (angle - coastDownAmt > 0) {
      angle = angle - TWO_PI - (coastDownAmt/2);
    } else if (angle - coastDownAmt < -TWO_PI) {
      angle = angle + TWO_PI - (coastDownAmt/2);
    } else {
      angle = angle - (coastDownAmt/2);
    }
      if (endDiff > 0) {
        endDiff = endDiff - 0.5;
    } if (endDiff < 0) {
        endDiff = endDiff + 0.5;
    } if (endDiff==0) {
      coastDown = false;
    }
  }

  // DEBUG TEXT
  if (debug) {
  fill(255);
  textSize(12);
  textAlign(LEFT, TOP);
  text("t: "+ t, 10, 12);
  text("degree: "+ degree, 10, 24);
  text("mouseAngle: "+mouseAngle, 10, 36);
  text("calcAngle: "+ calcAngle, 10, 48);
  text("offsetAngle: "+offsetAngle, 10, 60);
  text("rotCW: "+rotCW, 10, 72);
  text("angle: "+angle, 10, 84);
  text("coastDown: "+coastDown, 10, 96);
  text("endDiff: "+ endDiff, 10, 108);
  text("dx:"+dx, 10, 120);
  text("dy:"+dy, 10, 132);
}

// INTO TEXT
  if (intro == true) {
    fill(0, 0, 0, introBGOpacity);
    rectMode(CENTER);
    strokeWeight(0);
    rect(windowWidth/2, windowHeight/2, 400, 40, 10, 10);
    fill(255, 255, 255, introTextOpacity);
    textAlign(CENTER, TOP);
    textSize(16);
    text("Grab the dryer and spin it with your "+deviceToolName + ".", windowWidth/2, windowHeight/2 - 8);
  } else {
    if (introTextOpacity > 0) {
    fill(0, 0, 0, introBGOpacity);
    rectMode(CENTER);
    strokeWeight(0);
    rect(windowWidth/2, windowHeight/2, 400, 40, 10, 10);
    fill(255, 255, 255, introTextOpacity);
    textAlign(CENTER, TOP);
    textSize(16);
    text("Grab the dryer and spin it with your "+deviceToolName + ".", windowWidth/2, windowHeight/2 - 8);
    introBGOpacity = introBGOpacity - 12;
    introTextOpacity = introTextOpacity - 12;
  }
}

  if (degree > 180 && degree < 190) {
    intro = false;
  }
}


function mousePressed() {
  // Did I click on the wheel?
  if (dist(mouseX, mouseY, posX, posY) < wheelSize/2) {
    coastDown = false;
    endDiff = 0;
    dragging = true;
    // If so, keep track of relative location of click to corner of rectangle

    // ONLY WHEN DRAGGING :
    dx = mouseX - posX;
    dy = -(mouseY - posY);

    offsetAngle = atan2(dy, dx);
    offsetAngle = offsetAngle - angle;
    redraw();
    cursor('grabbing');

  }
}

// RESIZE IMAGE ON WINDOW RESIZE
function windowResized() {
  if(loaded) {
  resizeCanvas(windowWidth, windowHeight);
  background(0);
  wheelSize = constrain(min(windowHeight, windowWidth), 0, 920) - 20;
  posX = windowWidth/2;
  posY = windowHeight/2;
}
}


function mouseReleased() {
  if (loaded) {
  //DRAGGING STOPPED, CALCULATE ROTATION SPEED FOR COASTDOWN
  dragging = false;
  coastDown = true;

  // CAP COASTDOWN
  if (rotCW) {
    endDiff = min(int(degree - degreeOld), 100);
  } if (!rotCW) {
    endDiff = max(int(degree - degreeOld), -100);
  }
}


}

function mouseMoved() {
  if (loaded) {
  if (dist(mouseX, mouseY, posX, posY) < (wheelSize - 50)/2 && dragging == false) {
    cursor('grab');
  } else {
    cursor('default');
  }
}
}

function keyPressed() {
  if (keyCode == TAB) {
    debug = !debug;
  }
}
