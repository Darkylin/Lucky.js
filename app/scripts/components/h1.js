/**
 * Created by darkylin on 1/20/15.
 *
 * 负责h1标题的样式，根据内容区宽度决定字体大小及字体阴影个数.
 * 调用顺序一定晚于center，center会给size注入内容区宽度.
 *
 * =================Deprecated!!!!! 改用内容区scale方案===================
 */
define(['size','module'],function(view,module){
  module.exports = function(selector){
    var dom = $(selector);
    var fontSize = dom.data('fontsize');
    var shadowSize = dom.data('shadowsize');
    view.resize(function(v){
      var size = fontSize/v.contentOriginWidth* v.contentWidth;
      var shadow = shadowSize/v.contentOriginWidth* v.contentWidth;
      console.log(size,shadow)
      dom.css({
        fontSize:size
      })
    });
  }
});
