/**
 * Created by darkylin on 1/20/15.
 *
 * 主内容区的定位及大小
 *
 */
define(['module', 'size'], function (module, view) {
  module.exports = function (selector) {
    var dom = $(selector);
    var width = dom.data('width'),
      height = dom.data('height'),
      padding = dom.data('minpadding'),
      aspectRatio = width / height;
    view.contentOriginWidth = width;
    view.contentOriginHeight = height;

    var wrapper = $('<div>').attr('id','contentWrapper').css({overflow:'hidden',position:'relative'});
    dom.wrap(wrapper);
    dom.css({
      width: width,
      height: height
    });

    view.resize(function (v) {
      //若内容区宽高比大于显示区域，以屏幕高度等比缩放，垂直居中显示
      if (aspectRatio > v.aspectRatio) {
        width = Math.min(v.width - 2 * padding, v.contentOriginWidth);
        height = width / aspectRatio;
      } else {//若内容区宽高比小于显示区域，以屏幕宽度等比缩放，水平居中显示
        height = Math.min(v.height - 2 * padding, v.contentOriginHeight);
        width = height * aspectRatio;
      }
      dom.css({
        transform: 'scale(' + width / v.contentOriginWidth + ')'
      });
      wrapper.css({
        width: width,
        height: height,
        margin: ((v.height - height) / 2)+'px 0 0 '+((v.width - width) / 2)+'px'
      });

    });
  }
});
