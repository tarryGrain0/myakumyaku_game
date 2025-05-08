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
let pulseTimer = 0;

// Intense phase and spear animation state
let intensePhase = false;
let intenseTimer = 0;
let spearProgress = 0;
let spearActive = false;

// Array to hold flying mini-myakumya missiles
let missiles = [];

let lastMissileTime = 0;

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
    if (spearActive && spearProgress < 30) {
      // Draw spear of light
      push();
      translate(width / 2, height / 2);
      stroke(255, 255, 200, map(spearProgress, 0, 29, 255, 0));
      strokeWeight(8);
      line(attackedX, attackedY - 500, attackedX, attackedY + 500);
      pop();
      spearProgress++;
      return;
    }
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

  // Reset intense/modes when not in gameOver and not all collected
  if (!gameOver && collectedCount < 15) {
    intensePhase = false;
    intenseTimer = 0;
    spearActive = false;
    spearProgress = 0;
  }

  noStroke();

  // Heartbeat pulse for red balls when 10+ coins collected
  let pulseScale = 1;
  if (collectedCount >= 10) {
    pulseTimer += deltaTime;
    pulseScale = 1 + 0.1 * sin(pulseTimer / 200);
  }

  for (let b of balls) {
    fill(255, 0, 0);
    let wDraw = b.w * 3 * pulseScale;
    let hDraw = b.h * 3 * pulseScale;
    ellipse(b.x, b.y, wDraw, hDraw);
  }

  let now = millis();
  let shootInterval = (collectedCount >= 10) ? 500 : (collectedCount >= 5) ? 1000 : 2000;
  let shouldShoot = false;
  if (now - lastMissileTime >= shootInterval) {
    shouldShoot = true;
    lastMissileTime = now;
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

      // Shoot red missile from blue pupil toward cursor
      let dx2 = (mouseX - width / 2) - pupilX;
      let dy2 = (mouseY - height / 2) - pupilY;
      let mag2 = sqrt(dx2 * dx2 + dy2 * dy2);
      let vx2 = dx2 / mag2;
      let vy2 = dy2 / mag2;
      if (shouldShoot) {
        missiles.push({
          x: pupilX,
          y: pupilY,
          vx: vx2,
          vy: vy2,
          size: b.w * 0.5,
          timestamp: millis()
        });
      }

      // Spawn missile aimed at current mouse position
      let dx = (mouseX - width / 2) - eyeX;
      let dy = (mouseY - height / 2) - eyeY;
      let mag = sqrt(dx * dx + dy * dy);
      let vx = dx / mag;
      let vy = dy / mag;
    }
  }

  // Update and draw missiles
  for (let i = missiles.length - 1; i >= 0; i--) {
    let m = missiles[i];
    if (millis() - m.timestamp > 10000) {
      missiles.splice(i, 1);
      continue;
    }
    // Move missile with speed multiplier based on collected coins
    let speedMultiplier = 1;
    if (collectedCount >= 10) {
      speedMultiplier = 2.5;
    } else if (collectedCount >= 5) {
      speedMultiplier = 1.25;
    }
    m.x += m.vx * deltaTime * 0.2 * speedMultiplier;
    m.y += m.vy * deltaTime * 0.2 * speedMultiplier;
    // Draw red body
    fill(255, 0, 0);
    ellipse(m.x, m.y, m.size, m.size);
    // Draw eye (white)
    fill(255);
    ellipse(m.x, m.y, m.size * 0.5);
    // Draw pupil (blue)
    fill(0, 0, 255);
    ellipse(m.x, m.y, m.size * 0.25);
    // Collision with cursor
    let dx = mouseX - width / 2 - m.x;
    let dy = mouseY - height / 2 - m.y;
    if (dist(0, 0, dx, dy) < m.size * 0.5 && !gameOver && collectedCount < 15) {
      gameOver = true;
      // record spear spawn position for gameOver block
      attackedX = m.x;
      attackedY = m.y;
    }
    // Reflect at screen edges
    if (m.x <= -width / 2 || m.x >= width / 2) {
      m.vx *= -1;
      m.x = constrain(m.x, -width / 2, width / 2);
    }
    else if (m.y <= -height / 2 || m.y >= height / 2) {
      m.vy *= -1;
      m.y = constrain(m.y, -height / 2, height / 2);
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
        if (coin.hoverTime > 800 && !intensePhase && !coin.collected) {
          // Enter intense phase at 0.8s hover
          intensePhase = true;
          intenseTimer = 0;
        }
        if (coin.hoverTime > 1000 && !gameOver && !coin.collected) {
          // Trigger spear punishment at 1s hover
          spearActive = true;
          spearProgress = 0;
          attackedX = coin.x;
          attackedY = coin.y;
          gameOver = true;
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