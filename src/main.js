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
paddle.rect(-100, -12, 200, 24).fill(0x00f0ff);
paddle.x = 960;
paddle.y = 1072;
app.stage.addChild(paddle);