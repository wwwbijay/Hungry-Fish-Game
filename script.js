//canvas setup
const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
const canvasPos = canvas.getBoundingClientRect();
canvas.width = 800;
canvas.height = 500;

let score = 0;
let gameFrame = 0;
ctx.font = "50px Georgia";

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

    if (this.x != mouse.x) {
      this.x -= dx / 22;
    }
    if (this.y != mouse.y) {
      this.y -= dy / 22;
    }

    //set vertical boundary
    // if (this.y > this.game.height - this.height * 0.5)
    //   this.y = this.game.height - this.height * 0.5;
    // else if (this.y < -this.height * 0.5) this.y = -this.height * 0.5;
    //sprite animation
  }

  draw(context) {
    //draw line between player and mouse click point.
    if (mouse.click) {
      ctx.lineWidth = 0.2;
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(mouse.x, mouse.y);
      ctx.stroke();
    }

    //draw circle representation of player

    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();

    // context.drawImage(
    //   this.image,
    //   this.frameX * this.width,
    //   this.frameY * this.height,
    //   this.width,
    //   this.height,
    //   this.x,
    //   this.y,
    //   this.width,
    //   this.height
    // );
  }
}

const player = new Player();
//Bubbles

//Animation Loop

let lastTime = 0;
//animation loop
function animate(timeStamp) {
  const deltaTime = timeStamp - lastTime;
  lastTime = timeStamp;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  player.update(deltaTime);
  player.draw(ctx);
  requestAnimationFrame(animate);
}

animate(0);
