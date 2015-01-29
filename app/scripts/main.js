requirejs.config({
  baseUrl: 'scripts/components/',
  paths:{
    text:'/bower_components/requirejs-plugins/lib/text',
    json:'/bower_components/requirejs-plugins/src/json',
    random:'/bower_components/random/lib/random'
  }
});

require(['background','center','scrap','lotteryControl','lotteryConfig'],function(bg,center,scrap,lottery,config){
  $('#listbg').bg();
  $('#indexbg').bg().css("zIndex",100);
  center('#container');
  scrap.init('scrap');

  lottery.init("#lotteryCanvas","#titleText");

  $(document.body).on('keydown',function(e){
    if(e.keyCode==32)
      lottery.next();
    //console.log(lottery.candidate.length);
  });

  window.a=lottery;
});
