class Particle extends GameObject{
  constructor(ball,color, size){
    super(new Vector3(ball.pos.x + ball.size.w / 2 - size/2, ball.pos.y + ball.size.h / 2 - size/2,0), new Size(size,size));
    this.a = 1;
    this.dir = new Vector2(0,0);
    this.OnUpdate = true;
    this.r = color.r;
    this.g = color.g;
    this.b = color.b;
    this.arr = effects;
  }

  OnRender(rect){
    this.a -= 0.01;
    g.fillStyle = `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})`;
    g.fillRect(rect.x, rect.y, rect.w, rect.h);

    if(this.a < 0.03){
      this.arr.splice(this.arr.indexOf(this),1);
    }
  }

  Update(){
    const pos = this.pos;
    pos.x += this.dir.x * 0.5;
    pos.y += this.dir.y * 0.5;

    if(pos.x < 0 || pos.y < 0 || pos.x > 1200 || pos.y > 1600){
      this.arr.splice(this.arr.indexOf(this),1);
      return;
    }
  }
}
