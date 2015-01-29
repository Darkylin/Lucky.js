/**
 * Created by darkylin on 1/18/15.
 *
 * 处理背景图片至合适的大小及位置
 */
define(['size','lotteryConfig'], function (view,config) {
  $.fn.extend({bg:function () {
    var bg = $(this);
    var imageUrl = location.origin + '/' + config.view.bg[$(this).attr('id')];
    var image = new Image();
    image.src = imageUrl;
    var imageSize = {};

    function freshBackground(v) {
      var bgSize, bgPos;
      if (v.aspectRatio > imageSize.aspectRatio) {//缩放后视窗宽度有剩余
        bgSize = v.width + 'px ' + v.width / imageSize.aspectRatio + 'px';
        bgPos = 'center bottom';
      } else {//缩放后视窗高度有剩余或等比
        bgSize = v.height * imageSize.aspectRatio + 'px ' + v.height + 'px';
        bgPos = 'center center';
      }
      bg.css({
        background: 'url(' + imageUrl + ') no-repeat ',
        'background-size': bgSize,
        'background-position': bgPos,
        width: v.width,
        height: v.height
      });
    }

    image.onload = function () {
      imageSize.width = image.width;
      imageSize.height = image.height;
      imageSize.aspectRatio = imageSize.width / imageSize.height;
      freshBackground(view);
    };

    view.resize(freshBackground);
  }});

})
