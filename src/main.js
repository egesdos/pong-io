import { Application, Graphics } from 'pixi.js';

const app = new Application();

await app.init({
  width: 1920,
  height: 1080,
  background: '#0a0a14',
  antialias: true,
});

document.body.appendChild(app.canvas);

const paddle = new Graphics();
paddle.rect(-12, -100, 24, 200).fill(0x00f0ff);
paddle.x = 48;
paddle.y = 540;
app.stage.addChild(paddle);

const keys = {};
window.addEventListener('keydown', (event) => { keys[event.code] = true; });
window.addEventListener('keyup', (event) => { keys[event.code] = false; });

//ok tuşlarının sayfayı kaydırmasını engelle
window.addEventListener('keydown', (event) => {
  if (['ArrowUp', 'ArrowDown', 'Space'].includes(event.code)) {
    event.preventDefault()
    keys[event.code] = true
  }
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

app.ticker.add((ticker) => {
  const dt = ticker.deltaMS / 1000;

  let dir = 0;
  if (keys['ArrowUp']) dir -= 1;
  if (keys['ArrowDown']) dir += 1;

  paddle.y += dir * PADDLE_SPEED * dt;

  //bounce
  const hitX = ball.x - BALL_HALF < paddle.x + PADDLE_HALF_W &&
    ball.x + BALL_HALF > paddle.x - PADDLE_HALF_W;
  const hitY = ball.y + BALL_HALF > paddle.y - PADDLE_HALF &&
    ball.y - BALL_HALF < paddle.y + PADDLE_HALF;

  if (hitX && hitY && ballVelX < 0) {
    ball.x = paddle.x + PADDLE_HALF_W + BALL_HALF;
    ballVelX = -ballVelX * BOUNCE_PENALTY;
    ballVelY = ballVelY * BOUNCE_PENALTY;
  }

  //paddle sınırları
  if (paddle.y < PADDLE_HALF) paddle.y = PADDLE_HALF;
  if (paddle.y > 1080 - PADDLE_HALF) paddle.y = 1080 - PADDLE_HALF;

  ball.x += ballVelX * dt;
  ball.y += ballVelY * dt;

  //top sınırları
  if (ball.y < BALL_HALF) { ball.y = BALL_HALF; ballVelY = -ballVelY; }
  if (ball.y > 1080 - BALL_HALF) { ball.y = 1080 - BALL_HALF; ballVelY = -ballVelY; }
  if (ball.x < BALL_HALF) { ball.x = BALL_HALF; ballVelX = -ballVelX; }
  if (ball.x > 1920 - BALL_HALF) { ball.x = 1920 - BALL_HALF; ballVelX = -ballVelX; }
});