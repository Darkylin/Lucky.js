/**
 * Created by darkylin on 1/21/15.
 */
CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
  this.beginPath();
  this.moveTo(x + r, y);
  this.arcTo(x + w, y, x + w, y + h, r);
  this.arcTo(x + w, y + h, x, y + h, r);
  this.arcTo(x, y + h, x, y, r);
  this.arcTo(x, y, x + w, y, r);
  this.closePath();
  return this;
}

define(['exports', 'size', 'lotteryConfig', 'util'], function (exports, size, conf, util) {
  var ctx = {}, winners = {},width,height;

  var pause = false;
  var lastTitle = conf.current.award().title;
  var interval = conf.animate.interval, lastFrameTime = 0;
  var winner;
  window.out = '';
  window.list = function(){
    var s = window.localStorage;
    for(var key in s ){
      console.log('=============');
      console.log(key,'----');
      console.log(s.getItem(key));
      console.log('=============');
    }
  }
  var startTime;
  function log(str){
    window.out+=str+'\n';
    window.localStorage.setItem(startTime,window.out);
    console.log(str);
  }
  function requestNext(timestamp) {
    if (pause) {
      var data = [];
      log('------'+lastTitle+'------');
      conf.candidate.forEach(function(item,index){
        if(!(index in winner)){
          data.push(item);
        }else{
          log(item['集团名称']+'  '+item['名字']);
        }
      });
      conf.candidate = data;
      return;
    }
    if (timestamp - lastFrameTime >= interval) {
      lastFrameTime = timestamp;
      frame();
    }
    requestAnimationFrame(requestNext)

  }

  //根据屏幕像素密度修正cardDetail的坐标
  function updateCoordinate(cardDetail) {
    cardDetail.forEach(function (item) {
      item.x *= size.ratio;
      item.y *= size.ratio;
      item.font = item.font.replace(/\d+/, function (match) {
        return '' + parseInt(match) * size.ratio;
      });
    })
  }

  updateCoordinate(conf.view.cardDetail);

  var count = 0;
  function frame() {
    ctx.clearRect(0,0,width,height);
    var award = conf.current.award(),
      i = Math.floor(conf.current.stage / 2) * award.num / award.times,
      layout = conf.view.layout[i],
      dimension = util.pixelRatio(layout.dimension);

    //用于人员计数提供staffInfo
    var lim=conf.candidate.length;
    winner = {};
    lastTitle = award&&award.title;
    while (i--) {
      if(++count >= lim){
        count = 0;
      }
      winner[count]=1;
      drawCard(layout.next(i), dimension , conf.candidate[count]);
    }
  }
  function drawCard(layout, dimension, staffInfo) {
    var x = layout.x*size.ratio,
      y = layout.y*size.ratio;
    ctx.fillStyle = '#dead50';
    ctx.roundRect(x, y, dimension.width, dimension.height, 8).fill();
    conf.view.cardDetail.forEach(textCard(staffInfo, x, y));
  }

  function textCard(staffInfo, cardX, cardY) {
    return function (textInfo) {
      ctx.font = textInfo.font;
      ctx.textBaseline = 'bottom';
      ctx.fillStyle = textInfo.color;
      ctx.fillText(staffInfo[textInfo.key], textInfo.x + cardX, textInfo.y + cardY);
    }
  }

  exports.setCanvas = function (canvas) {
    var $$ = $(canvas), padding = parseInt($$.css('padding'));
    canvas = $$[0];
    ctx = canvas.getContext('2d');
    width = canvas.width = size.ratio * ($$.width() - padding * 2);
    height = canvas.height = size.ratio * ($$.height() - padding * 2);
  };
  exports.winners = function () {
    return winners;
  };
  exports.pause = function () {
    pause = true;
  };
  exports.start = function () {
    if(!startTime){
      startTime=(new Date).toString();
    }
    pause = false;
    requestNext();
  };

  exports.toggle = function () {
    if (pause) {
      exports.start();
    } else {
      exports.pause();
    }
  };
  exports.status = function () {
    return pause ? {pause: true, msg: 'pause'} : {pause: false, msg: 'drawing in'};
  };

});
