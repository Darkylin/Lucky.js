/**
 * Created by darkylin on 1/18/15.
 */
define(function(){
  var mainCanvas = document.getElementById('mainCanvas');
  var context = mainCanvas.getContext('2d');

//根据屏幕宽高及像素密度重设canvas大小
  function fullScreen(canvas) {
    //setViewArg();
    //canvas.width = viewArg.canvasWidth;
    //canvas.height = viewArg.canvasHeight;
    //canvas.style.width = viewArg.width + 'px';
    //canvas.style.height = viewArg.height + 'px';
  }

  function resize() {
    fullScreen(mainCanvas);
  }
  resize();
  $(function () {
    console.log(require(['size']));
  });
})
