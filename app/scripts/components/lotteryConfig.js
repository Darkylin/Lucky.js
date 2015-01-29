/**
 * Created by darkylin on 1/26/15.
 */
define(['lotteryDefaultConfig', 'exports', 'json!../../data/hotel.json', 'random','util'], function (bak, exports, data, Random,util) {

  exports.current = {
    index: 0,//当前奖项在awards中的位序，
    stage: 0//当前阶段，注意，每一个阶段都一个中间状态即正在抽奖中，所以取值范围是[0,times*2]
  };
  util.addMethod(exports.current,'info',function(){
    var current = exports.current, award = exports.awards[current.index];
    return award.name + ':' + current.stage + '/' + award.times;
  });
  util.addMethod(exports.current,'award',function(){
    return exports.awards[exports.current.index];
  });
  //中奖名单
  util.addMethod(exports.current,'winner',function(){
    var random = new Random(function(){
      return (new Date).getTime();
    });
    var award = exports.current.award(),name=award.name;
    var count = award.num/award.times;
    var winner = [],winnerIndex=[];
    var candidate = [],len = data.length;
    for(var i=0;i<len;i++){
      candidate.push(i);
    }
    while(count--){
      var index;
      index = random.pick(candidate);
      candidate.slice(index,1);
      winner.push(data[index]);
      winnerIndex.push(index);
    }
    setTimeout((function(winnerIndex){
      return function(){
        winnerIndex.sort();
        var i = winnerIndex.length;
        while(i--){
          data.splice(i,1);
        }
      }
    }(winnerIndex)),0);
    result[name]=result[name]||[];
    result[name].push(winner);
    return winner;
  });
  //中奖结果
  var result={};
  window.result = result;
  /**
   * 奖项设置，按序抽取
   * name 用于输出info
   * title  用于页面输出title h1
   * num  奖项个数
   * times  分几次抽完这些奖项
   */
  exports.awards = [{
    title: "三等奖获奖名单",
    num: 5,
    times: 1
  }, {
    title: "二等奖获奖名单",
    num: 5,
    times: 1
  }, {
    title: "一等奖获奖名单",
    num: 5,
    times: 1
  }, {
    title: "特等奖获奖名单",
    num: 1,
    times: 1
  }];
  var random = new Random(Random.engines.mt19937().autoSeed());

  exports.candidate = random.shuffle(data);
  var control = {};
  exports.control = control;

  control.shuffle = function () {
    random.shuffle(data);
  };

  var view = {};
  exports.view = view;
  //view.cardDetail = bak.view.cardDetail.annual;
  view.cardDetail = [{
    key: '名字',
    x: 16, y: 87,
    font: 'bold italic 30px yahei',
    color: '#4b080a'
  }, {
    key: '集团名称',
    x: 16, y: 139,
    font: '19px yahei',
    color: '#4b080a'
  }];

  //view.layout = bak.view.layout.annual;
  view.layout = {
    '5': {
      next: function (i) {
        var row = Math.floor(i/3),col = i%3;
        var rtn = {
          x:(row==0?1:183)+col*353,
          y:50+row*280
        };
        return rtn;
      },
      dimension: {
        width: 333,
        height: 200
      },
      cardScale:1
    },
    '1':{
      next:function(){
        return {
          x:354,
          y:190
        }
      },
      dimension: {
        width: 333,
        height: 200
      },
      cardScale:1
    }
  };
  exports.transitionEveryTime = false;
  exports.view.bg={
    indexbg:'images/hotel-index.jpg',
    listbg:'images/list-without-tree.jpg'
  };
  exports.animate={
    interval:50
  };

});
