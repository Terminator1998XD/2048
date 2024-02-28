class GameObject {
  constructor(pos, size) {
    this.pos = pos;
	this.size = size;
	this.Visible = true;
	this.Rotate = 0;
	this.CurrentTexture = 0;
	this.Animate = false;
	this.OnUpdate = false;
  }
  
  setTexture(texture)
  {
	  this.Animate = false;
	  this.texData = [texture];
  }
  
  setAnim(anim)
  {
	  this.Animate = true;
	  this.animData = [anim];
  }
  
  setTextures(textures)
  {
	  this.Animate = false;
	  this.texData = textures;
  }
  
  setAnims(anims)
  {
	  this.Animate = true;
	  this.animData = anims;
  }

  NextFrame() {
	return this.Animate ? this.animData[this.CurrentTexture].nextFrame() : this.texData[this.CurrentTexture]; 
  }
  
  OnRender(rect)
  {
	  g.drawImage(this.NextFrame(),rect.x,rect.y,rect.w,rect.h);
  }
  
  Update()
  {
	  
  }
}