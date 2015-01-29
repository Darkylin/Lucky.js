/**
 * Created by darkylin on 1/26/15.
 */
define({
  view: {
    /**
     * 卡片内容尺寸信息
     */
    cardDetail: {
      /**
       * 年会用
       *
       * 代表名字上边距16，字号23，下边距12
       * 部门字号18下边距11
       * 号码字号15
       * 卡片左补白16
       */
      annual: [{
        key: '姓名',
        x: 16, y: 39,
        font: 'bold italic 23px yahei',
        color: '#4b080a'
      }, {
        key: '一级部门',
        x: 16, y: 69,
        font: 'italic 18px yahei',
        color: '#4b080a'
      }, {
        key: '员工编号',
        x: 16, y: 95,
        font: 'italic 15px yahei',
        color: '#4b080a'
      }]
    },
    layout: {
      annual: {
        '25': {
          next: function (i) {
            var row = Math.floor(i/5),col = i%5;
            return {
              x:col*212,
              y:row*130
            };
          },
          dimension: {
              width: 192,
              height: 110
          },
          cardScale:1
        }
      }
    }
  }

})
