function addContainsSupport(arr){
  Object.defineProperty(arr,'contains',{
    value:function(item){
      return this.some(function(i){
        return i===item;
      })
    },
    enumerable:false,
    configurable:false,
    writable:false
  });
  return arr;
}

function pick(data,itemArr){
  data.forEach(function(item){
    for(var i in item){
      if(!itemArr.contains(i)){
        delete item[i];
      }
    }
  })
}
//pick(data,addContainsSupport(['姓名','一级部门','员工编号']));

define(['size'],function(size){
  return {
    chainify:function(rtn){
      for (var i in rtn) {
        rtn[i] = (function (method) {
          return method instanceof Function ? function () {
            return method.apply(null, arguments) || rtn;
          }:method;
        }(rtn[i]));
      }
      return rtn;
    },
    addMethod:function(obj,name,fn){
      Object.defineProperty(obj,name,{
        value:fn,
        configurable:false,
        enumerable:false,
        writable:false
      })
    },
    pixelRatio:function(obj){
      var ratio = size.ratio,rtn={};
      if(ratio!=1){
        for(var i in obj){
          rtn[i] = obj[i]*ratio;
        }
      }else{
        rtn = obj;
      }
      return rtn;
    }
  }
})
