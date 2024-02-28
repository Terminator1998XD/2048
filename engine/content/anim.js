class Anim {
  constructor(frames, delay = 0) {
    this.frames = frames;
    this.currentFrame = 0;
    this.frameCount = frames.length-1;
    this.onDelay = delay > 0;
    this.delay = this.onDelay ? new DateTimeClock(delay) : null;
  }

  nextFrame() {
    if (!this.onDelay || this.delay.check()) {
      this.currentFrame = this.currentFrame == this.frameCount ? 0 : this.currentFrame + 1;
    }

    return this.frames[this.currentFrame];
  }

  nextFrameOrReturnImage(image) {
    if ((!this.onDelay || this.delay.check()) && this.currentFrame < this.frames.length) {
      this.currentFrame += 1;
    }

    return this.currentFrame > this.frameCount ? image : this.frames[this.currentFrame];
  }

  byProc(animationProgress) {
    const progress = Math.max(0, Math.min(1, animationProgress));
    let frameIndex = parseInt(Math.floor(progress * this.frameCount));

    if(frameIndex >= this.frameCount) frameIndex = this.frameCount - 1;
    else if(frameIndex < 0) frameIndex = 0;

    return this.frames[frameIndex];
  }
}
