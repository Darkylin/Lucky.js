/**
 * Created by darkylin on 1/26/15.
 */
define(['lotteryAnimate', 'lotteryConfig', 'util', 'transition','scrap'], function (animate, conf, util, transition,scrap) {
  var h1,over=false;

  function next() {
    if(over){
      return beginTransition();
    }
    var stage = conf.current.stage++,
      awardIndex = conf.current.index,
      awards = conf.awards,
      award = awards[awardIndex];
    if (stage == 0) {//当前奖项第一个阶段
      h1.data('text',conf.current.award().title);
      if(conf.transitionEveryTime||awardIndex == 0){
        transition.hide();
        scrap.start();
      }
      next();
    } else if (stage == award.times*2) {//到当前奖项最后一个阶段
      conf.transitionEveryTime && beginTransition();
      if(conf.current.index == awards.length-1){
        stop();
        over = true;
        return;
      }else{
        conf.current.stage = 0;
        stop();
      }
      conf.current.index++;
    } else if (stage % 2 == 0) {//停止阶段
      stop();
    } else if (stage % 2 == 1) {
      animate.start();
    }
  }
  function beginTransition(){
    transition.show();
  }
  function stop(){
    animate.pause();
  }
  return util.chainify({
    init: function (canvasSelector, h1Selector) {
      animate.setCanvas(canvasSelector);
      h1 = $(h1Selector);
    },
    next: next,
    info: conf.current.info
  });
});
