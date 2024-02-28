var ysdk = null;
var advlock = false;

function adsCallback(data){
  console.log(data);
  if(adsCallback.onClose != null) adsCallback.onClose();
  if(adsCallback.onRewarded != null) adsCallback.onRewarded();
}

var adv = {
  showFullscreenAdv: function(info){
    let cb = info.callbacks;
    adsCallback.onClose = cb.onClose;
    adsCallback.onRewarded = cb.onRewarded;
    ysdk.showAds({interstitial: true});
  },
  showRewardedVideo: function(info){
    let cb = info.callbacks;
    adsCallback.onClose = cb.onClose;
    adsCallback.onRewarded = cb.onRewarded;
    ysdk.showAds({interstitial: false});
  }
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
  adv.showFullscreenAdv({callbacks: {onClose: function(){advlock = false; SoundsEnable = true;playMusic(); end();} }});
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
  adv.showRewardedVideo({callbacks: {onRewarded:reward, onClose: function(){advlock = false;SoundsEnable = true; if(mEnable){playMusic();} end();} }});
}
