let fairyX, fairyY;
let fairySize = 50;
let fairySpeed = 3;
let wingFlap = 0;

let petals = [];
let sparkles = [];
let gameState = "play";

function setup() {
  createCanvas(650, 450);
  resetFairy();
}

function draw() {
  drawMeadow();

  if (gameState === "play") {
    updateFairy();
    drawFairy();
    updateSparkles();
    drawSparkles();
  } else {
    updatePetals();
    drawPetals();
  }

  wingFlap += 0.2;
}

/* ---------------- FAIRY ---------------- */

function resetFairy() {
  fairyX = random(fairySize, width - fairySize);
  fairyY = random(fairySize, height - fairySize);
  petals = [];
  sparkles = [];
  gameState = "play";
}

function updateFairy() {
  let dx = fairyX - mouseX;
  let dy = fairyY - mouseY;
  let distance = sqrt(dx*dx + dy*dy);

  if(distance < 150) { 
    let angle = atan2(dy, dx);
    fairyX += cos(angle) * fairySpeed;
    fairyY += sin(angle) * fairySpeed;
  } else {
    fairyX += random(-1.5, 1.5);
    fairyY += random(-1.5, 1.5);
  }

  fairyX = constrain(fairyX, fairySize/2, width - fairySize/2);
  fairyY = constrain(fairyY, fairySize/2, height - fairySize/2);

  // Sparkles
  sparkles.push({x: fairyX + random(-10,10), y: fairyY + random(-10,10), size: random(3,6), alpha: 255});
}

function drawFairy() {
  push();
  translate(fairyX, fairyY);

  // Flapping wings
  let wingW = fairySize * 0.8 + sin(wingFlap) * 8;
  let wingH = fairySize * 0.3 + cos(wingFlap) * 4;

  fill(200, 255, 255, 150);
  noStroke();
  ellipse(-fairySize*0.6, -fairySize*0.2, wingW, wingH);
  ellipse(fairySize*0.6, -fairySize*0.2, wingW, wingH);

  // Body & glow
  fill(255, 200, 255);
  ellipse(0,0,fairySize);
  fill(255, 200, 255, 100);
  ellipse(0,0,fairySize+20);

  pop();
}

/* ---------------- SPARKLES ---------------- */

function updateSparkles() {
  for (let s of sparkles) s.alpha -= 5;
  sparkles = sparkles.filter(s => s.alpha > 0);
}

function drawSparkles() {
  noStroke();
  for (let s of sparkles) fill(255,255,100,s.alpha), ellipse(s.x,s.y,s.size);
}

/* ---------------- PETALS ---------------- */

function createPetals() {
  for (let i = 0; i < 40; i++) petals.push({
    x: fairyX, y: fairyY, size: random(6,12), speedY: random(1,4),
    speedX: random(-2,2), rotation: random(TWO_PI), spin: random(-0.1,0.1)
  });
}

function updatePetals() {
  for (let p of petals) p.y += p.speedY, p.x += p.speedX, p.rotation += p.spin;
}

function drawPetals() {
  noStroke();
  fill(255,180,200);
  for (let p of petals) push(), translate(p.x,p.y), rotate(p.rotation), ellipse(0,0,p.size,p.size*0.7), pop();
}

/* ---------------- INPUT ---------------- */

function mousePressed() {
  if (gameState === "play") {
    if (dist(mouseX, mouseY, fairyX, fairyY) < fairySize/2) createPetals(), gameState="gameOver";
  } else resetFairy();
}

/* ---------------- BACKGROUND ---------------- */

function drawMeadow() {
  background(100,200,100); // grass
  for(let i=0;i<15;i++){
    let x=i*50+25, y=height-30+sin(frameCount*0.02+i)*5;
    fill(255, random(100,200), 200), ellipse(x,y,10,10);
    stroke(0,200,0), line(x,y,x,height), noStroke();
  }
}
