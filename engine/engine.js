var canvas = document.createElement("canvas");
var g = canvas.getContext("2d");
document.body.appendChild(canvas);

resizeCanvas();

var isMobile = false;

window.addEventListener('resize', resizeCanvas);

function resizeCanvas() {
    canvas.width = isMobile ? window.innerWidth : Math.min(600,window.innerWidth);
    canvas.height = window.innerHeight;
    window.scaleX = canvas.width/900;
    window.scaleY = canvas.height/1600;

    if(!isMobile){
      canvas.style.marginLeft = `calc(50% - ${canvas.width / 2}px)`;
    }
}

var LMouseDown = false;
var RMouseDown = false;
var AnyMouseDown = false;
var GameSpeed = 1;

var mx = 0, my = 0;
canvas.addEventListener('mousedown', function(event) {
  AnyMouseDown = true;
  const rect = event.currentTarget.getBoundingClientRect();
  mx = (event.clientX - rect.left) / scaleX; // Получаем координату X точки нажатия мышью
  my = (event.clientY - rect.top) / scaleY; // Получаем координату Y точки нажатия мышью
});

canvas.addEventListener('mousemove', function(event) {
  const rect = event.currentTarget.getBoundingClientRect();
  mx = (event.clientX - rect.left) / scaleX; // Получаем координату X точки нажатия мышью
  my = (event.clientY - rect.top) / scaleY; // Получаем координату Y точки нажатия мышью
});

canvas.addEventListener('touchstart', function(event) {
  event.preventDefault();
  AnyMouseDown = true;
  const rect = event.currentTarget.getBoundingClientRect();
  const touch = event.touches[0]; // Получаем первое касание
  mx = (touch.clientX - rect.left) / scaleX; // Получаем координату X точки касания
  my = (touch.clientY - rect.top) / scaleY; // Получаем координату Y точки касания
});

canvas.addEventListener('mouseup', function(event) {
  AnyMouseDown = false;
});

canvas.addEventListener('touchend', function(event) {
  event.preventDefault();
  AnyMouseDown = false;
});

var dim = new Dim(0);
var player = [];
var effects = [];

var camera = new Vector2(0,0);
var CameraFovW = 0;
var CameraFovH = 0;
var scaleX = 1;
var scaleY = 1;

const RadToGrad = 180.0/Math.PI;
const GradToRad = Math.PI/180.0;

var OnPause = true;

function Render(){
	g.resetTransform();
	g.scale(scaleX, scaleY);

  g.shadowColor = 'black';
  g.shadowBlur = 5;
  g.shadowOffsetX = 0;
  g.shadowOffsetY = 15;

	CameraFovW = camera.x + canvas.width * (1/scaleX);
	CameraFovH = camera.y + canvas.height * (1/scaleY);

	DrawArray(dim.map);
  DrawArray(effects);
	DrawArray(player);

  g.resetTransform();

  g.shadowColor = 'rgba(0,0,0,0)';
  g.scale(scaleX, scaleY);
  g.font = 'bold 30px Arial';
  g.fillStyle = 'white';
  g.fillText(scoreText, 20,1600 - 128);

	requestAnimationFrame(Render);
}

function DrawArray(curmap) {
  for (let obj = 0; obj < curmap.length; obj++) {
    const drawable = curmap[obj];

    if (drawable !== null && drawable.Visible) {

      const x = drawable.pos.x;
      const y = drawable.pos.y;
      const w = drawable.size.w;
      const h = drawable.size.h;

      if (x >= camera.x - w && y >= camera.y - h && x - w <= CameraFovW && y - h <= CameraFovH)  {
        const tx = x - camera.x + w / 2;
        const ty = y - camera.y + h / 2;

        g.translate(tx, ty);
        const Rotate = drawable.Rotate;
        if (Rotate !== 0) g.rotate(Rotate);

        //LastScreenSpace.x = tx;
        //LastScreenSpace.y = ty;
        //drawable.LastScreenSpace = LastScreenSpace;

        drawable.OnRender({x: -drawable.size.w / 2,y: -drawable.size.h / 2,w: w,h: h});

        if (Rotate !== 0) g.rotate(-Rotate);
        g.translate(-tx, -ty);
      }
    }
  }
}

function ObjectCumShoot(obj) {
  camera.x = obj.pos.x - canvas.width / 2 + obj.size.w / 2;
  camera.y = obj.pos.y - canvas.height / 2 + obj.size.h / 2;
}

function ObjectCumShoot2(obj) {
  camera.x = 0;
  camera.y = obj.pos.y - canvas.height;
}

function VectorCumShoot(position) {
  camera.x = position.x - canvas.width / 2;
  camera.y = position.y - canvas.height / 2;
}

function VectorCumShoot(position) {
  camera.x = position.x - canvas.width / 2;
  camera.y = position.y - canvas.height / 2;
}

function ObjectCumFollow(obj) {
  const followX = obj.pos.x - canvas.width / 2 + obj.size.w / 2;
  const followY = obj.pos.y - canvas.height / 2 + obj.size.h / 2;

  if (camera.x !== followX) camera.x=BeginCumFollow(camera.x, followX);
  if (camera.y !== followY) camera.y=BeginCumFollow(camera.y, followY);
}

var FollowSpeed = 5;

function BeginCumFollow(axis, val) {
  if (Math.abs(axis - val) > FollowSpeed) {
    if (axis > val)
      axis -= FollowSpeed;
    else
      axis += FollowSpeed;
  } else {
    axis = val;
  }

  return axis;
}

Scripts = [];

function Update()
{
	if (!OnPause) {

		for (let obj = 0; obj < dim.map.length; obj++) {
		  const u = dim.map[obj];

		  if (u.OnUpdate) u.Update();
		}

		for (let obj = 0; obj < effects.length; obj++) {
		  effects[obj].Update();
		}

		for (let i = 0; i < player.length; i++) {
			const p = player[i];
			if(p.OnUpdate)p.Update();
		  }

      for (let obj = 0; obj < Scripts.length; obj++) {
  		  Scripts[obj]();
  		}
	}
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(value, max));
}

function EngineRun()
{
	Render();
	setInterval(Update, 1000/20);
}

function hexToRGB(hex) {
    const r = parseInt(hex.slice(1, 3), 16),
        g = parseInt(hex.slice(3, 5), 16),
        b = parseInt(hex.slice(5, 7), 16);

    return {r:r, g:g, b:b};
}

function getrand(min, max) {
  max = max - 1;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
