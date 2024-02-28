function updlb(){
  let xp = score;
  let rec = localStorage['record777'];

  if(rec == null){
    localStorage['record777'] = xp;
    rec = xp;

	if(ysdk!=null)
	  ysdk.getLeaderboards()
	  .then(lb => {
		lb.setLeaderboardScore('lead', parseInt(rec));
	  });
	  else console.log("ysdk == null");
  }else {
    rec = parseInt(rec);

    if(xp > rec){
      rec = xp;
      localStorage['record777'] = xp;

	  if(ysdk!=null)
	  ysdk.getLeaderboards()
	  .then(lb => {
		lb.setLeaderboardScore('lead', parseInt(rec));
	  });
	  else console.log("ysdk == null");
    }
  }

  $('.crecord').html(parseInt(xp));
  $('.record').html(parseInt(rec));
}
