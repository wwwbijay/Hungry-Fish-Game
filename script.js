//canvas setup
const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
const canvasPos = canvas.getBoundingClientRect();

canvas.width = 800;
canvas.height = 500;

let score = 0;
let gameFrame = 0;
ctx.font = "30px Georgia";
let gameSpeed = 1;
let gameOver = false;

//Mouse Interactivity
const mouse = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  click: false,
};

document.addEventListener("mousedown", (e) => {
  mouse.x = e.x - canvasPos.x;
  mouse.y = e.y - canvasPos.y;
  mouse.click = true;
});

document.addEventListener("mouseup", (e) => {
  mouse.click = false;
});

//Player
//Handle functions of main characters
const playerLeft = new Image();
playerLeft.src = "assets/fish_swim_left.png";

const playerRight = new Image();
playerRight.src = "assets/fish_swim_right.png";

class Player {
  constructor() {
    this.radius = 50;
    this.angle = 0;
    this.x = canvas.width / 2;
    this.y = canvas.height / 2;
    this.frameX = 0;
    this.frameY = 0;
    this.frame = 0;
    this.spriteWidth = 498;
    this.spriteHeight = 327;
  }

  update() {
    const dx = this.x - mouse.x;
    const dy = this.y - mouse.y;

    let theta = Math.atan2(dy, dx);
    this.angle = theta;

    if (this.x != mouse.x) {
      this.x -= dx / 22;
    }
    if (this.y != mouse.y) {
      this.y -= dy / 22;
    }
  }

  draw(context) {
    //draw line between player and mouse click point.
    if (mouse.click) {
      context.lineWidth = 0.2;
      context.beginPath();
      context.moveTo(this.x, this.y);
      context.lineTo(mouse.x, mouse.y);
      context.stroke();
    }

    //draw circle representation of player

    // context.fillStyle = "red";
    // context.beginPath();
    // context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    // context.fill();
    // context.closePath();

    //Draw Player score
    context.fillStyle = "black";
    context.fillText("Score:" + score, 20, 50);

    context.save();
    context.translate(this.x, this.y);
    context.rotate(this.angle);
    if (this.x >= mouse.x) {
      context.drawImage(
        playerLeft,
        this.frameX * this.spriteWidth,
        this.frameY * this.spriteHeight,
        this.spriteWidth,
        this.spriteHeight,
        0 - this.spriteWidth / 8,
        0 - this.spriteHeight / 8,
        this.spriteWidth / 4,
        this.spriteHeight / 4
      );
    } else {
      context.drawImage(
        playerRight,
        this.frameX * this.spriteWidth,
        this.frameY * this.spriteHeight,
        this.spriteWidth,
        this.spriteHeight,
        0 - this.spriteWidth / 8,
        0 - this.spriteHeight / 8,
        this.spriteWidth / 4,
        this.spriteHeight / 4
      );
    }
    context.restore();
  }
}

const player = new Player();

//Bubbles
const bubblesArray = [];
const bubbleImage = new Image();
bubbleImage.src = "assets/bubble-single.png";

class Bubble {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = canvas.height + Math.random() * canvas.height;
    this.radius = 50;
    this.speed = Math.random() * 3 + 1;
    this.distance;
    this.counted = false;
    this.sound = Math.random() <= 0.5 ? "sound1" : "sound2";
  }
  update() {
    this.y -= this.speed;
    const dx = this.x - player.x;
    const dy = this.y - player.y;
    this.distance = Math.sqrt(dx * dx + dy * dy);
  }
  draw() {
    // ctx.fillStyle = "skyBlue";
    // ctx.beginPath();
    // ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    // ctx.fill();
    // ctx.closePath();

    ctx.drawImage(
      bubbleImage,
      this.x - 65,
      this.y - 65,
      this.radius * 2.6,
      this.radius * 2.6
    );
  }
}

//create sound element
const bubbleSound1 = document.createElement("audio");
bubbleSound1.src = "assets/sound1.ogg";
const bubbleSound2 = document.createElement("audio");
bubbleSound2.src = "assets/sound2.ogg";

function addBubbles() {
  if (gameFrame % 100 == 0) {
    bubblesArray.push(new Bubble());
  }

  for (let i = 0; i < bubblesArray.length; i++) {
    bubblesArray[i].draw();
    bubblesArray[i].update();

    if (bubblesArray[i].y < 0 - bubblesArray[i].radius) {
      bubblesArray.splice(i, 1);
      i--;
    } else if (
      bubblesArray[i].distance <
      bubblesArray[i].radius + player.radius
    ) {
      if (!bubblesArray[i].counted) {
        if (bubblesArray[i].sound == "sound1") bubbleSound1.play();
        else bubbleSound2.play();

        score++;
        bubblesArray[i].counted = true;
        bubblesArray.splice(i, 1);
        i--;
      }
    }
  }
}

//Enemies
const enemyImage = new Image();
enemyImage.src = "assets/enemy-swimming.png";

class Enemy {
  constructor() {
    this.radius = 60;
    this.angle = 0;
    this.x = canvas.width + 200;
    this.y = Math.random() * (canvas.height - 150) + 90;
    this.speed = Math.random() * 2 + 2;
    this.frameX = 0;
    this.frameY = 0;
    this.frame = 0;
    this.spriteWidth = 418;
    this.spriteHeight = 397;
    this.distance;
  }

  update() {
    this.x -= this.speed;
    if (this.x < 0 - this.radius * 2) {
      this.x = canvas.width + 200;
      this.y = Math.random() * (canvas.height - 150) + 90;
      this.speed = Math.random() * 2 + 2;
    }
    //sprite animation
    if (gameFrame % 5 == 0) {
      this.frame++;
      if (this.frame > 11) this.frame = 0;
      if (this.frame == 3 || this.frame == 7 || this.frame == 11) {
        this.frameX = 0;
      } else {
        this.frameX++;
      }

      if (this.frame < 3) this.frameY = 0;
      else if (this.frame < 7) this.frameY = 1;
      else if (this.frame < 11) this.frameY = 2;
      else this.frameY = 0;
    }

    //collision detection
    let dx = this.x - player.x;
    let dy = this.y - player.y;
    this.distance = Math.sqrt(dx * dx + dy * dy);
    if (this.distance < this.radius + player.radius) {
      handleGameOver();
    }
  }

  draw() {
    // draw circle representation of enemy

    ctx.save();

    ctx.drawImage(
      enemyImage,
      this.frameX * this.spriteWidth,
      this.frameY * this.spriteHeight,
      this.spriteWidth,
      this.spriteHeight,
      this.x - this.radius,
      this.y - this.radius,
      this.radius * 2,
      this.radius * 2
    );
    ctx.restore();
  }
}

const enemy1 = new Enemy();
function handleEnemy() {
  enemy1.draw();
  enemy1.update();
}

function handleGameOver() {
  ctx.save();
  ctx.fillStyle = "white";
  ctx.font = "bold 55px serif";
  ctx.fillText("Game Over", canvas.width / 2 - 100, canvas.height / 2 - 20);
  gameOver = true;
  ctx.restore();
}

//Animation Loop

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // handleBackground();
  addBubbles();
  handleEnemy();
  player.update();
  player.draw(ctx);
  if (!gameOver) requestAnimationFrame(animate);
  gameFrame++;
}

animate();
window.addEventListener("resize", () => {
  canvasPos = canvas.getBoundingClientRect();
});
