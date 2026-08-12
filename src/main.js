import { Application, Graphics, Text } from 'pixi.js';

const app = new Application();

await app.init({
  width: 1920,
  height: 1080,
  background: '#0a0a14',
  antialias: true,
});

document.body.appendChild(app.canvas);

function createPaddle(x, upKey, downKey, side) {
  const shape = new Graphics();
  shape.rect(-12, -100, 24, 200).fill(0x00f0ff);
  shape.x = x;
  shape.y = 540;
  app.stage.addChild(shape);

  return { shape: shape, upKey: upKey, downKey: downKey, side: side };
}

const paddles = [
  createPaddle(48, 'KeyW', 'KeyS', 1),
  createPaddle(1872, 'ArrowUp', 'ArrowDown', -1),
];

const keys = {};
window.addEventListener('keydown', (event) => {
  if (['ArrowUp', 'ArrowDown', 'Space'].includes(event.code)) {
    event.preventDefault()
  }
  keys[event.code] = true
});
window.addEventListener('keyup', (event) => {
  keys[event.code] = false;
});

const PADDLE_SPEED = 500;
const PADDLE_HALF = 100;
const BALL_SPEED = 500;
const BALL_SIZE = 30;
const BALL_HALF = 15;
const PADDLE_HALF_W = 12;
const BOUNCE_PENALTY = 0.95;

const ball = new Graphics();
ball.rect(-BALL_HALF, -BALL_HALF, BALL_SIZE, BALL_SIZE).fill(0xff00a0);
ball.x = 960;
ball.y = 540;
app.stage.addChild(ball);

let ballVelX = -BALL_SPEED;
let ballVelY = 30;

let scoreL = 0;
let scoreR = 0;

const scoreText = new Text({
  text: '0 : 0',
  style: { fill: 0xffffff, fontSize: 64, fontFamily: 'monospace' },
});
scoreText.anchor.set(0.5);
scoreText.x = 960;
scoreText.y = 80;
app.stage.addChild(scoreText);

function serve(dir) {
  ball.x = 960;
  ball.y = 540;
  ballVelX = BALL_SPEED * dir;
  ballVelY = (Math.random() * 2 - 1) * 60;
  scoreText.text = `${scoreL} : ${scoreR}`;
}

app.ticker.add((ticker) => {
  const dt = ticker.deltaMS / 1000;

  for (const p of paddles) {
    let dir = 0;
    if (keys[p.upKey]) dir -= 1;
    if (keys[p.downKey]) dir += 1;

    p.shape.y += dir * PADDLE_SPEED * dt;

    if (p.shape.y < PADDLE_HALF) p.shape.y = PADDLE_HALF;
    if (p.shape.y > 1080 - PADDLE_HALF) p.shape.y = 1080 - PADDLE_HALF;
  }

  ball.x += ballVelX * dt;
  ball.y += ballVelY * dt;


  for (const p of paddles) {
    const hitX = ball.x - BALL_HALF < p.shape.x + PADDLE_HALF_W &&
      ball.x + BALL_HALF > p.shape.x - PADDLE_HALF_W;
    const hitY = ball.y + BALL_HALF > p.shape.y - PADDLE_HALF &&
      ball.y - BALL_HALF < p.shape.y + PADDLE_HALF;

    if (hitX && hitY && ballVelX * p.side < 0) {
      ball.x = p.shape.x + p.side * (PADDLE_HALF_W + BALL_HALF);
      ballVelX = -ballVelX * BOUNCE_PENALTY;
      ballVelY = ballVelY * BOUNCE_PENALTY;
    }
  }

  if (ball.y < BALL_HALF) { ball.y = BALL_HALF; ballVelY = -ballVelY; }
  if (ball.y > 1080 - BALL_HALF) { ball.y = 1080 - BALL_HALF; ballVelY = -ballVelY; }
  if (ball.x < -BALL_HALF) { scoreR++; serve(-1); }
  if (ball.x > 1920 + BALL_HALF) { scoreL++; serve(1); }
});