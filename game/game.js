function Init(){
	if(window['lang'] != null) return;

	window.lang = 'ru';
	window.scoreui = $('#score');
	window._advprompt = [];
	window.score = 0;
	window.scoremul = 1;
	window.gameover = false;

	loadBackgroundTrackPosition();

	let rec = localStorage['record777'];

  if(rec != null && rec > 0){
			$('.record').html(parseInt(rec));
	}
	else{
		$('#startGame .record').parent().remove();
	}

	for(let i = 0; i < 5; i++){
		dim.map.push(new Track(i));
	}

	dim.map.push(new Block());

	EngineRun();

	$('.overlay').show();

	hideTexts();

	const queryString = window.location.search.slice(1);
	  if (queryString) {
		  const paramsArray = queryString.split('&');
		  window.paramsObject = {};

		  paramsArray.forEach(param => {
			  const [key, value] = param.split('=');
			  paramsObject[key.toLowerCase()] = value.toLowerCase();
		  });  
	  }
	  else window.paramsObject = {lang: 'en'};

	if (typeof iframeApi === 'undefined') {
			console.log('Cannot find iframeApi function, are we inside an iframe?');
			return;
	}

	iframeApi({
			appid: 33236,
			getLoginStatusCallback: function(status) {},
			userInfoCallback: function(info) {console.log(info);},
			adsCallback: adsCallback
	}).then(function(api){
		window.ysdk = api;
		console.log('VK SDK initialized');
		window.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

		if(localStorage['savelang'] != null) {
			window.lang = localStorage['savelang'];
		}
		else window.lang = paramsObject.lang == 'ru_ru' ? 'ru' : 'en';//ysdk.environment.i18n.lang;

		$('#scoreblock').show();

		if(!window.isMobile){
			$('body').css({'background-image': 'url("textures/htmlback.jpg")','background-size':'cover'});
			const neonColor = 'rgb(255, 255, 255)'; // Здесь вы можете выбрать цвет неона
			const border = '1px solid white';
			$(canvas).css({
				'box-shadow': `0 0 10px ${neonColor}`,
				'border-left': border,
				'border-right': border
			});
		}

		scoreTxt = TXT('score');
		scoreText = scoreTxt + 0;
		translateBlocks();
		fillSettings();
		resizeCanvas();
	}, function(code){
		console.log(code);
	});
}

function PlayClick(){
	yabanner(function(){
		document.getElementById("startGame").remove();
		$('.overlay').hide();
		OnPause = false;
		playMusic();
	});
}

function TogglePause(){
	OnPause = !OnPause;
	saveBackgroundTrackPosition();

	if(OnPause){
		updlb();
		$('.overlay').show(500);
		$('#pausem').show();
	}
	else {
		$('.overlay').hide();
		$('#pausem').hide();
		playMusic();
	}
}

document.addEventListener("visibilitychange", function() {
  if (document.visibilityState === "hidden") {
		if(!OnPause){
			OnPause = true;
			updlb();
			$('.overlay').show(500);
			$('#pausem').show();
		}
		pauseMusic();
		StopAllSound();
  }
});

function NewGameCallback(){
	$('.overlay').hide();
	$('#deadscr').hide();
	$('#pausem').hide();

	dim.map = [];
	Track.pool = [];
	Track.enableMoveY = true;
	for(let i = 0; i < 5; i++){
		dim.map.push(new Track(i));
	}

	dim.map.push(new Block());
	window.score = 0;
	window.scoremul = 1;
	window._advprompt = [];
	window.gameover = false;
	scoreText = scoreTxt + 0;
	OnPause = false;
	playMusic();
}

function RebornPlayer(){
	window.gameover = false;
	setTimeout(function(){
		forblocks(function(block){
			block.RebornPl();
		});

		const tracks = Track.pool;
    for(let i = 0; i < tracks.length; i++){
      const track = tracks[i];
			track.moveDown = 0;
			track.OnUpdate = false;
		}

		Track.OnEndStack();

		OnPause = false;

		timer_go(function(){
			forblocks(function(block){
				block.OnUpdate = true;
			});
			const tracks = Track.pool;
	    for(let i = 0; i < tracks.length; i++){
	      const track = tracks[i];
				track.OnUpdate = true;
			}
			Track.OnEndStack();
			playMusic();
		});
	},500);
}

function Lose(){
	if(window.gameover) return;

	pauseMusic();
	PlaySound('lose');
	OnPause = true;
	window.gameover = true;
	dead_advprompt();
}

var scoreText = "";
var scoreTxt = "";

function AddScore(_score){
	score += _score * scoremul;
	scoreText = scoreTxt + parseInt(score);
}

function NewGame(){
	yabanner(NewGameCallback);
}

let reslist = [

];

function AddTexArr(name, count){
	for(let i = 0; i < count; i++){
		reslist.push('textures/'+name+i+'.png');
	}
}

function PreInit(){

	if(reslist.length == 0){
		Init();
		return;
	}

	resources.load(reslist);
	resources.onReady(Init);
}

document.addEventListener('DOMContentLoaded', function() {
  PreInit();
});
