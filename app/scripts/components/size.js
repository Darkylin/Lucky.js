//视图相关
define(function () {
  var viewArg = {},resizeQueue=[];

  function setViewArg() {
    viewArg.ratio = window.devicePixelRatio || 1;
    viewArg.width = window.innerWidth;
    viewArg.height = window.innerHeight;
    viewArg.aspectRatio = viewArg.width / viewArg.height;
  }
  viewArg.resize = function(cb){
    if(!(typeof cb == 'function')){
      return;
    }
    resizeQueue.push(cb);
    $(function(){
      cb(viewArg);
    });
  }
  $(setViewArg);
  $.resize(function(){
    setViewArg();
    resizeQueue.forEach(function(item){
      item(viewArg);
    });
  });
  return viewArg;
})

