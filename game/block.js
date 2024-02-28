class Block extends GameObject{
  constructor(){
    super(new Vector3(2 * trackSizeW,1600 - trackSizeW,1),new Size(trackSizeW,trackSizeW));
    this.mass = startNumbers[getrand(0,startNumbers.length)];
    window.bullet = this;
    this.setColor();
  }

  setColor(){
    const str = this.mass.toString();
    const len = str.length;
    this.font = 'bold '+(140 - len * 25)+'px Arial';

    let color = blockColors[this.mass];
    if(color == undefined) color = blockColors[str[0]];

    this.color1 = color == undefined ? "#5c5d5c" : color.color1;
    this.color2 = color == undefined ? "#292929" : color.color2;
  }

  GoToTrack(track){
    this.task = 'AddToTrack';
    this.OnUpdate = true;
    this.track = track;
    this.pos.x = track.pos.x;
    this.toY = this.track.lastBlockY;
    PlaySound('step');
    track.blocks.push(this);
    dim.map.push(new Block());
  }

  AddToTrack(){
    this.pos.y -= 100;
    if(this.pos.y <= this.toY){
      this.pos.y = this.toY;
      if(this.toY == this.track.lastBlockY) Track.enableMoveY = true;
      this.task = 'MoveDown';
    }
  }

  RebornPl(){
    if(this.track.blocks.indexOf(this) > 3){
      this.task = 'ExplodeTask';
    }
    else{
      this.OnUpdate = false;
    }
  }

  ExplodeTask(){
    const color = hexToRGB(this.color1);
    for(let i = 0; i < 360; i+=25){
      const p = new Particle(this,color,12);
      const rad = i*GradToRad;
      p.dir = new Vector2(Math.cos(rad)*10,Math.sin(rad)*10);
      effects.push(p);
    }
    const blocks = this.track.blocks;
    blocks.splice(blocks.indexOf(this),1);
    dim.map.splice(dim.map.indexOf(this),1);
  }

  MoveDown(){
    if(Track.enableMoveY){
      const npy = this.pos.y + MoveDownSpeed;
      this.pos.y = npy;
      if(npy + trackSizeW >= 1600 - trackSizeW){
        Lose();
      }

      const env = this.track.CheckEnviroment(this);
      if(env != null){
        Track.enableMoveY = false;

        if(this.track == env.track || this.track.blocks.length > env.track.blocks.length){
          this.stack = env;
          this.task = 'MoveToStack';
        } else {
          env.stack = this;
          env.pos.y = this.pos.y;
          env.task = 'MoveToStack';
        }
      }
    }
  }

  EndStack(){
    this.stack.mass *= 2;
    this.stack.setColor();
    dim.map.splice(dim.map.indexOf(this),1);
    const blocks = this.track.blocks;
    blocks.splice(blocks.indexOf(this),1);
    Track.enableMoveY = true;
    Track.OnEndStack();
    AddScore(this.stack.mass);
    PlaySound('bubble');
  }

  MoveToStack(){
    if(this.stack.task == 'AddToTrack') return;
    const to = this.stack.pos;
    if(to.x < this.pos.x){
      this.pos.x -= 50;
      if(to.x > this.pos.x){
        this.pos.x = to.x;
        this.pos.y = to.y;
        this.EndStack();
      }
    }
    else if(to.y < this.pos.y){
      this.pos.y -= 50;
      if(to.y > this.pos.y){
        this.pos.x = to.x;
        this.pos.y = to.y;
        this.EndStack();
      }
    }
    else if (to.x > this.pos.x){
      this.pos.x += 50;
      if(to.x < this.pos.x){
        this.pos.x = to.x;
        this.pos.y = to.y;
        this.EndStack();
      }
    }
  }

  Update(){
    this[this.task]();
  }

  OnRender(rect){
    // Создание градиента в зависимости от массы блока
    var gradient = g.createRadialGradient(
      rect.x + rect.w/2, rect.y + rect.h/2, 0,
      rect.x + rect.w/2, rect.y + rect.h/2, rect.w/2
    );
    gradient.addColorStop(0, this.color1);
    gradient.addColorStop(1, this.color2);

    // Заливка прямоугольника градиентом
    g.fillStyle = gradient;
    g.fillRect(rect.x, rect.y, rect.w, rect.h);

    g.save();
    g.shadowColor = 'rgba(0,0,0,0)';
    // Вывод массы блока над ним
    g.fillStyle = 'white';
    g.font = this.font; // Замените YourCustomFont на ваше название подключенного шрифта
    const size = g.measureText(this.mass);
    g.fillText(this.mass, rect.x + rect.w / 2 - size.width/2, rect.y + rect.h / 2 + size.actualBoundingBoxAscent / 2);

    g.restore();
  }
}
