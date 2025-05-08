let cursorImg;
let coinImg;
let balls = [];
let coins = [];
let numBalls = 11;
let radius = 180;
let collectedCount = 0;
let gameOver = false;
let attackProgress = 0;
let attackedX = 0;
let attackedY = 0;

function preload() {
  cursorImg = loadImage('dorobou.png');
  coinImg = loadImage('coin.png');
}

function setup() {
  createCanvas(1700, 980);
  cursor('none');
  // noLoop();
  angleMode(DEGREES);
  background(255);
  noStroke();
  translate(width / 2, height / 2);

  for (let i = 0; i < numBalls; i++) {
    let angle = 360 / numBalls * i;
    let x = cos(angle) * radius;
    let y = sin(angle) * radius;
    let w = random(30, 70);
    let h = random(30, 80);

    balls.push({ x, y, w, h, angle, i });
  }

  let attempts, safe;
  for (let i = 0; i < 15; i++) {
    attempts = 0;
    do {
      safe = true;
      let x = random(-width / 2 + 50, width / 2 - 50);
      let y = random(-height / 2 + 50, height / 2 - 50);

      for (let b of balls) {
        if (dist(x, y, b.x, b.y) < 75 + max(b.w, b.h)) {
          safe = false;
          break;
        }
      }
      if (safe) {
        for (let c of coins) {
          if (dist(x, y, c.x, c.y) < 75 * 2) {
            safe = false;
            break;
          }
        }
      }
      attempts++;
      if (attempts > 100) break;
      if (safe) {
        coins.push({ x, y, collected: false, hoverTime: 0 });
        break;
      }
    } while (!safe);
  }
}

function draw() {
  if (gameOver) {
    if (attackProgress < 60) {
      background(255);
      translate(width / 2, height / 2);
      noFill();
      stroke(255, 0, 0, map(attackProgress, 0, 59, 255, 0));
      strokeWeight(map(attackProgress, 0, 59, 20, 1));
      let r = map(attackProgress, 0, 59, 0, max(width, height));
      ellipse(attackedX, attackedY, r, r);
      attackProgress++;
      return;
    }
    // after animation completes
    background(255);
    fill(255, 0, 0);
    textSize(100);
    textAlign(CENTER, CENTER);
    text("GAME OVER", width / 2, height / 2);
    return;
  }

  background(255);
  translate(width / 2, height / 2);
  noStroke();

  for (let b of balls) {
    fill(255, 0, 0);
    ellipse(b.x, b.y, b.w * 3, b.h * 3);
  }

  for (let b of balls) {
    if (b.i % 3 === 0) {
      let eyeX = b.x + cos(b.angle) * b.w * 0.15;
      let eyeY = b.y + sin(b.angle) * b.h * 0.15;
      fill(255);
      ellipse(eyeX, eyeY, b.w * 0.4 * 3);

      // 瞳をマウス位置に追従
      let dir = createVector(mouseX - width / 2 - eyeX, mouseY - height / 2 - eyeY);
      dir.setMag(b.w * 0.25);
      let pupilX = eyeX + dir.x;
      let pupilY = eyeY + dir.y;

      fill(0, 0, 255);
      ellipse(pupilX, pupilY, b.w * 0.2 * 3);
    }
  }

  imageMode(CENTER);

  for (let coin of coins) {
    if (!coin.collected) {
      image(coinImg, coin.x, coin.y, 75, 75);

      let dx = mouseX - width / 2 - coin.x;
      let dy = mouseY - height / 2 - coin.y;
      let d = dist(0, 0, dx, dy);

      if (d < 37.5) {
        // Hovering: accumulate time
        coin.hoverTime += deltaTime;
        // If hover exceeds 1 second, game over
        if (coin.hoverTime > 1000 && !gameOver && !coin.collected) {
          gameOver = true;
          attackProgress = 0;
          attackedX = coin.x;
          attackedY = coin.y;
        }
      } else if (coin.hoverTime > 0) {
        // Left the coin zone before 1 second: collect
        if (coin.hoverTime <= 1000 && !coin.collected) {
          coin.collected = true;
          collectedCount++;
        }
        // Reset hover timer
        coin.hoverTime = 0;
      }
      // Warning ring if hovered over 0.5s but not yet 1s
      if (coin.hoverTime > 200 && coin.hoverTime < 1000 && !gameOver) {
        noFill();
        stroke(255, 215, 0, map(coin.hoverTime, 500, 1000, 255, 0));
        strokeWeight(4);
        let progress = (coin.hoverTime - 500) / 500;
        let r = lerp(75, 120, progress);
        ellipse(coin.x, coin.y, r, r);
      }
    }
  }

  if (collectedCount === 15 && !gameOver) {
    fill(0, 200, 0);
    textSize(100);
    textAlign(CENTER, CENTER);
    text("CLEAR!", 0, 0);
    return;
  }

  fill(0);
  textSize(32);
  textAlign(LEFT, TOP);
  text(`Coins: ${collectedCount}`, -width / 2 + 20, -height / 2 + 20);

  imageMode(CENTER);
  image(cursorImg, mouseX - width / 2, mouseY - height / 2, 120, 120);
}