

// GLOBAL VARIABLES


// arrays to store particles and messages
let particles = [];
let dataWords = [];
let messages = [];

// current mode of the program
let mode = "shadow";

// tracking user activity
let activityScore = 0;
let keyCount = 0;
let clickCount = 0;

// start time for progression system
let startTime;

// not used yet but could show profile
let showProfile = false;

// store UI buttons
let buttons = [];

// sound variables (not used yet)
let typingSound;
let ambientSound;

// image variable (not used yet)
let eyeImg;



// LOAD FILES

function preload() {
  
}



// SETUP 

function setup() {
  createCanvas(windowWidth, windowHeight); // full screen canvas
  startTime = millis(); // save start time

  createButtons(); // create UI buttons
}



// MAIN DRAW LOOP 

function draw() {
  backgroundByMode(); // change background based on mode

  runMode(); // run special mode effects

  updateParticles(); // update particle system
  updateWords(); // update text system
  updateMessages(); // update random messages

  drawUI(); // draw buttons
  drawStats(); // show stats

  checkProgression(); // change modes over time
}



// MODES SYSTEM

function runMode() {
  if (mode === "shadow") {
    // normal mode (no extra effects)
  }

  if (mode === "surveillance") {
    drawSurveillance(); // red tracking effect
  }

  if (mode === "glitch") {
    drawGlitch(); // random glitch visuals
  }

  if (mode === "profile") {
    drawProfile(); // show user profile
  }
}



// BACKGROUND EFFECTS

function backgroundByMode() {
  // different colours for each mode
  if (mode === "shadow") background(10, 10, 10, 25);
  if (mode === "surveillance") background(30, 0, 0, 40);
  if (mode === "glitch") background(0, 0, 0, 80);
  if (mode === "profile") background(0, 20, 40, 50);
}



// PARTICLES SYSTEM (MOUSE TRAILS)

class Particle {
  constructor(x, y) {
    // start near mouse position
    this.x = x + random(-5, 5);
    this.y = y + random(-5, 5);

    this.size = random(5, 20); // random size
    this.alpha = 255; // fully visible

    // random movement
    this.xSpeed = random(-1, 1);
    this.ySpeed = random(-1, 1);
  }

  update() {
    this.x += this.xSpeed; // move
    this.y += this.ySpeed;
    this.alpha -= 3; // fade out
  }

  show() {
    noStroke();
    fill(100, 200, 255, this.alpha); // blue glow
    ellipse(this.x, this.y, this.size);
  }
}

function updateParticles() {
  // loop backwards so we can remove items safely
  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update();
    particles[i].show();

    // remove when invisible
    if (particles[i].alpha <= 0) {
      particles.splice(i, 1);
    }
  }
}



// TEXT SYSTEM (KEYBOARD INPUT)

class DataWord {
  constructor(letter, x, y) {
    this.letter = letter; // typed key
    this.x = x;
    this.y = y;
    this.alpha = 255;

    this.ySpeed = random(-0.5, -2); // float upward
  }

  update() {
    this.y += this.ySpeed;
    this.alpha -= 2; // fade
  }

  show() {
    fill(255, this.alpha);
    textSize(20);
    text(this.letter, this.x, this.y);
  }
}

function updateWords() {
  for (let i = dataWords.length - 1; i >= 0; i--) {
    dataWords[i].update();
    dataWords[i].show();

    // remove when invisible
    if (dataWords[i].alpha <= 0) {
      dataWords.splice(i, 1);
    }
  }
}



// RANDOM TRACKING MESSAGES

class Message {
  constructor() {
    // random message text
    this.text = random([
      "Tracking Enabled",
      "We See You",
      "Collecting Data...",
      "Profile Updating",
      "Behaviour Logged"
    ]);

    this.x = random(width);
    this.y = random(height);
    this.alpha = 255;
  }

  update() {
    this.alpha -= 2; // fade
  }

  show() {
    fill(255, 0, 0, this.alpha); // red text
    text(this.text, this.x, this.y);
  }
}

function updateMessages() {
  // randomly create messages
  if (random() < 0.01) {
    messages.push(new Message());
  }

  for (let i = messages.length - 1; i >= 0; i--) {
    messages[i].update();
    messages[i].show();

    // remove when invisible
    if (messages[i].alpha <= 0) {
      messages.splice(i, 1);
    }
  }
}



// INTERACTION EVENTS

function mouseMoved() {
  activityScore++; // track movement

  // create particles at mouse
  for (let i = 0; i < 5; i++) {
    particles.push(new Particle(mouseX, mouseY));
  }
}

function mousePressed() {
  clickCount++; // count clicks

  // check if any button is clicked
  for (let b of buttons) {
    b.checkClick(mouseX, mouseY);
  }
}

function keyTyped() {
  keyCount++; // count keys

  // create floating letter
  dataWords.push(new DataWord(key, mouseX, mouseY));
}



// UI SYSTEM (BUTTONS)

class Button {
  constructor(x, y, w, h, label, action) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.label = label;
    this.action = action; // what would happen when clicked
  }

  show() {
    fill(255);
    rect(this.x, this.y, this.w, this.h);

    fill(0);
    textSize(14);
    text(this.label, this.x + 10, this.y + 20);
  }

  checkClick(mx, my) {
    // check if mouse is inside button
    if (
      mx > this.x &&
      mx < this.x + this.w &&
      my > this.y &&
      my < this.y + this.h
    ) {
      this.action(); // run button action
    }
  }
}

function createButtons() {
  // create buttons for each mode
  buttons.push(new Button(20, 20, 120, 30, "Shadow", () => mode = "shadow"));
  buttons.push(new Button(20, 60, 120, 30, "Surveillance", () => mode = "surveillance"));
  buttons.push(new Button(20, 100, 120, 30, "Glitch", () => mode = "glitch"));
  buttons.push(new Button(20, 140, 120, 30, "Profile", () => mode = "profile"));
}

function drawUI() {
  for (let b of buttons) {
    b.show();
  }
}



// STATS DISPLAY

function drawStats() {
  fill(255);
  textSize(14);

  // show live data tracking
  text("Activity: " + activityScore, width - 150, 20);
  text("Keys: " + keyCount, width - 150, 40);
  text("Clicks: " + clickCount, width - 150, 60);
}


// SPECIAL MODES

function drawSurveillance() {
  fill(255, 0, 0);
  ellipse(mouseX, mouseY, 10); // tracking dot

  // random lines pointing to user
  if (random() < 0.05) {
    line(random(width), 0, mouseX, mouseY);
  }
}

function drawGlitch() {
  // random glitch rectangles
  for (let i = 0; i < 10; i++) {
    fill(random(255), random(255), random(255));
    rect(random(width), random(height), random(50), random(10));
  }
}

function drawProfile() {
  fill(255);
  textSize(24);

  text("USER PROFILE", width / 2 - 100, height / 2 - 100);

  textSize(16);
  text("Activity Level: " + getActivityLevel(), width / 2 - 100, height / 2 - 50);
  text("Typing Behaviour: " + getTypingSpeed(), width / 2 - 100, height / 2 - 20);
  text("Clicks: " + clickCount, width / 2 - 100, height / 2 + 10);
}



// PROFILE LOGIC

function getActivityLevel() {
  if (activityScore < 200) return "Low";
  if (activityScore < 500) return "Medium";
  return "High";
}

function getTypingSpeed() {
  if (keyCount < 20) return "Slow";
  if (keyCount < 50) return "Average";
  return "Fast";
}



// PROGRESSION SYSTEM

function checkProgression() {
  let elapsed = (millis() - startTime) / 1000;

  // change modes over time
  if (elapsed > 20) mode = "surveillance";
  if (elapsed > 40) mode = "glitch";
  if (elapsed > 60) mode = "profile";
}



// RESIZE CANVAS

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
