/**
 * Created by darkylin on 1/26/15.
 *
 * 页面过渡场景
 */
define(function(){
return{
  show:function(){
    $("#indexbg").removeClass('hide');
  },
  hide:function(){
    $("#indexbg").addClass('hide');
  }
}
});
