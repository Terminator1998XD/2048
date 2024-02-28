var ysdk = null;
var advlock = false;

function adsCallback(data){
  console.log(data);
}

function yabanner(end){
  if(advlock){
    return;
  }
  advlock = true;

  if(window['ysdk'] == null){
    end();
  }

  pauseMusic();
  SoundsEnable = false;
  StopAllSound();
  ysdk.adv.showFullscreenAdv({callbacks: {onClose: function(){advlock = false; SoundsEnable = true;playMusic(); end();} }});
}

function yarbanner(reward,end, mEnable = true){
  if(advlock){
    return;
  }
  advlock = true;

  if(window['ysdk'] == null){
    end();
  }

  if(window['ysdk'] == null){
    reward();
    end();
  }

  pauseMusic();
  SoundsEnable = false;
  StopAllSound();
  ysdk.adv.showRewardedVideo({callbacks: {onRewarded:reward, onClose: function(){advlock = false;SoundsEnable = true; if(mEnable){playMusic();} end();} }});
}
