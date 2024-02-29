var __localisationTexts__ = {
  "ru":{
    res:'Шарик был не того цвета, который вы выбрали',
    reborn: "Последний шанс",
    scm: "Умножить очки x2",
    adv:"за рекламу",
    on: "Вкл.",off: "Выкл.",
    mus: "Музыка", snd: "Звуки",
    score: "Очков: "
  },
  "en":{
    res:'The ball was not the same color, which one you chose',
    scm:"Multiply points x2",
    adv:"for viewing ads",
    reborn:"Second life",
    on: "On",off: "Off",
    mus: "Music", snd: "Sounds",
    score: "Score: "
  }
}

function TXT(id){
  return __localisationTexts__[lang][id];
}

function hideTexts(){
  $('[translate]').hide();
}

function translateBlocks(){

  if(translateBlocks.flag){
    $('[translate]').each(function() {
      $(this).attr('translate_ru',$(this).html());
    });
    translateBlocks.flag = false;
  }

    $('[translate]').each(function() {
      const value = $(this).attr(lang == 'ru' ? 'translate_ru':'translate');
      $(this).html(value);
    $(this).show();
  });
}

translateBlocks.flag = true;

function setlang(l){
  window.lang = l;
  translateBlocks();
  scoreTxt = TXT('score');
  AddScore(0);
  localStorage['savelang'] = l;
}
