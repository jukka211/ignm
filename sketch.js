let mic;
let level;
let colors;
let threshold = 0.01;
let canSwitch = true;

let currentColor;
let targetColor;
let transitionProgress = 1.0; // Start fully transitioned
let transitionSpeed = 0.03;   // Controls how fast color fades

function setup() {
  createCanvas(390, 844);
  mic = new p5.AudioIn();
  mic.start();

  colors = ['black', 'white', 'red', 'limegreen', 'blue'];
  currentColor = color(random(colors));
  targetColor = currentColor;
  noStroke();
}

function draw() {
  level = mic.getLevel();

  // Trigger color change if sound is detected
  if (level > threshold && canSwitch) {
    let newColor;
    do {
      newColor = color(random(colors));
    } while (newColor.toString() === targetColor.toString()); // prevent repeat
    targetColor = newColor;
    transitionProgress = 0.0;
    canSwitch = false;
  }

  // Reset switch permission when sound is low
  if (level < threshold) {
    canSwitch = true;
  }

  // Update currentColor smoothly toward targetColor
  if (transitionProgress < 1.0) {
    transitionProgress += transitionSpeed;
    transitionProgress = constrain(transitionProgress, 0, 1);
    currentColor = lerpColor(currentColor, targetColor, transitionProgress);
  }

  background(currentColor);

  // Set fill color based on background
  if (currentColor.toString() === color('black').toString()) {
    fill(255); // white
  } else {
    fill(0); // black
  }

  // Horizontal blocks (static)
  rect(31, 354, 23, 23);   
  rect(90, 295, 68, 23);   
  rect(185, 272, 63, 23);  
  rect(225, 336, 134, 23); 

  // Vertical blocks (animated)
  rect(31, 396, 23, map(level * 8.0, 0, 1, 75, 300));   
  rect(90, 295, 23, map(level * 15, 0, 1, 220, 400));  
  rect(134, 340, 23, map(level * 7.5, 0, 1, 210, 400));
  rect(185, 272, 23, map(level * 3.5, 0, 1, 210, 400));
  rect(225, 272, 23, map(level * 8.5, 0, 1, 280, 500));
  rect(293, 336, 23, map(level * 4.8, 0, 1, 165, 300));
  rect(336, 336, 23, map(level * 9.2, 0, 1, 134, 300));
}
