//canvas setup
const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
const canvasPos = canvas.getBoundingClientRect();
canvas.width = 800;
canvas.height = 500;

let score = 0;
let gameFrame = 0;
ctx.font = "30px Georgia";

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

    this.image = document.getElementById("player");
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
    ctx.fillStyle = "skyBlue";
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
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
  }

  for (let i = 0; i < bubblesArray.length; i++) {
    if (bubblesArray[i].y < 0 - bubblesArray[i].radius) {
      bubblesArray.splice(i, 1);
    }
    if (bubblesArray[i]) {
      if (bubblesArray[i].distance < bubblesArray[i].radius + player.radius) {
        if (!bubblesArray[i].counted) {
          if (bubblesArray[i].sound == "sound1") bubbleSound1.play();
          else bubbleSound2.play();

          score++;
          bubblesArray[i].counted = true;
          bubblesArray.splice(i, 1);
        }
      }
    }
  }
}

//Animation Loop

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  addBubbles();
  player.update();
  player.draw(ctx);
  requestAnimationFrame(animate);
  gameFrame++;
}

animate();
