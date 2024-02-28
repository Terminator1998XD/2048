const trackSizeW = 900 / 5;
class Track extends GameObject{
  constructor(n){
    super(new Vector3(n * trackSizeW, 0, 0), new Size(trackSizeW, 1600));
    this.id = n;
    this.OnHover = false;
    this.OnUpdate = true;
    this.blocks = [];
    this.lastBlockY = 0;
    this.moveDown = 0;
    Track.pool.push(this);
  }

  static enableMoveY = true;
  static pool = [];

  OnRender(rect){
    g.save();
    g.shadowColor = 'rgba(0,0,0,0)';
    g.fillStyle = !this.OnHover ? "#2F034B" : "#1F0343";
    g.fillRect(rect.x,rect.y,rect.w,rect.h);
    g.restore();
  }

  CheckEnviroment(block){
    const blocks = this.blocks;
    const index = blocks.indexOf(block);

    if(index > 0){
      const lb = blocks[index - 1];
      if(block.mass == lb.mass){
        return lb;
      }
    }

    if(this.id > 0){
      const lt = Track.pool[this.id - 1];
      const ltb = lt.blocks;

      if(ltb.length > index){
        const lb = ltb[index];
        if(block.mass == lb.mass){
          return lb;
        }
      }
    }

    return null;
  }

  static OnEndStack(){
    const tracks = Track.pool;
    for(let i = 0; i < tracks.length; i++){
      const track = tracks[i];
      let minus = Math.max(track.moveDown - 16, 0);
      track.moveDown = minus;

      for(let j = 0; j < track.blocks.length; j++){
        track.blocks[j].pos.y = track.moveDown + (j * trackSizeW);
      }
    }
  }

  OnClick(){
    this.lastBlockY = this.moveDown + (this.blocks.length * trackSizeW);
    bullet.GoToTrack(this);
    Track.enableMoveY = false;
  }

  Update(){
    this.OnHover = mx >= this.pos.x && my >= this.pos.y && mx <= this.pos.x+this.size.w && my <= this.pos.y+this.size.h;
    if(this.OnHover && AnyMouseDown){
      this.OnClick();
      AnyMouseDown = false;
    }

    if(Track.enableMoveY){
      this.moveDown += MoveDownSpeed;
     }
  }
}

function forblocks(func){
  const tracks = Track.pool;
  for(let i = 0; i < tracks.length; i++){
    const blocks = tracks[i].blocks;
    for(let j =0;j < blocks.length; j++) func(blocks[j]);
  }
}
