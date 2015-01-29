/**
 * partial compatible , stable during IE10+
 *
 * @author yuhuan.wang
 */
;
(function (undefined) {
  var TEST_NEW_DOM = /^<[^<>]+>$/,
    TEST_SELECTOR = /^[#\.\w]/,
    FRAGMENT = document.createDocumentFragment();

  function $(arg) {
    if (arg instanceof Function) {
      if (document.readyState != "loading") //interactive or complete
        return arg();
      return $(document).on("DOMContentLoaded", arg)
    } else if (this == window) {
      return new $(arg);
    }

    if (arg instanceof Node || arg == window) {
      this[0] = arg;
      this.length = 1;
    } else if (arg instanceof NodeList) {
      extend(this, arg);
    } else if (typeof arg == "string") {
      if (TEST_NEW_DOM.test(arg)) { //<div>
        this.length = 1;
        this[0] = document.createElement(arg.slice(1, arg.length - 1));
      } else if (TEST_SELECTOR.test(arg)) { //selsector
        extend(this, document.querySelectorAll(arg));
      } else { //HTML fragment
        FRAGMENT.innerHTML = arg;
        extend(this, FRAGMENT.childNodes);
      }

    }
  };
  var slice = Array.prototype.slice;
  var proto = $.prototype;
  proto.append = function (dom) {
    if (dom instanceof $)
      dom = dom[0];
    this.appendChild(dom);
  }
  var NEED_PX = /^margain|^padding|^border\w*Radius|top|right|bottom|left|fontSize|[wW]idth|[hH]eight|textIndent|wordSpacing/;

  function css(key, value) {
    var arg = params(arguments),
      o = arg.get("object"),
      me = this;
    if (o) {
      each(o, function (value, key) {
        css.call(me, key, value);
      })
    } else if (value !== undefined) {
      if (NEED_PX.test(key) && value[value.length - 1] != "x")
        value += "px";
      this.style[key] = value;
    } else {
      var pseudo = key.split(":");
      pseudo = pseudo.length > 1 ? (":" + pseudo[1]) : null;
      return r(window.getComputedStyle(this, pseudo)[key]);
    }
  };
  proto.css = css;
  function manipulateClass(operate) {
    return function (className) {
      var classes = className.split(" "),
        me = this;
      each(classes, function (item) {
        me.classList[operate](item);
      });
    }
  }

  extend(proto, {
    addClass: manipulateClass("add"),
    removeClass: manipulateClass("remove"),
    hasClass: manipulateClass("contains"),
    toggle: manipulateClass("toggle")
  });

  function bind(dom, eventName, cb) {
    dom && dom.addEventListener(eventName, cb, false);
  }

  proto.on = function (eventName, cb) {
    var args = params(arguments);
    if (args.count("string") > 1) {
      bind(this, eventName, function (e) {
        var dom = args.get("string", 1);
        if (e.target == dom) {
          args.get("function").call(this, e);
        }
      })
    } else {
      bind(this, eventName, cb);
    }
  };

  function each(arr, cb, inverse) {
    var _each = Array.prototype.forEach;
    var i = 0,
      lim = arr && arr.length;
    if (lim != undefined) {
      if (_each && !inverse)
        return _each.call(arr, cb);
      if (inverse)
        arr.reverse();
      for (; i < lim; i++) {
        cb(arr[i], i, arr);
      }
    } else {
      for (var i in arr) {
        if (arr.hasOwnProperty(i))
          cb(arr[i], i, arr);
      }
    }
  }


  //get the type of argument
  function typeOf(arg) {
    var type = Object.prototype.toString.call(arg);
    return type.slice(8, type.length - 1).toLowerCase();
  }

  //deal with the parameter
  function params(args) {
    function ParamRtn(args) {
      args = slice.call(args);
      var rtn = this.rtn = {};
      each(args, function (item) {
        var type = typeOf(item),
          arr = rtn[type] || (rtn[type] = []);
        arr.push(item);
      })
    }

    ParamRtn.prototype = {
      constructor: ParamRtn,
      get: function (type, index) {
        var rtnArr = this.rtn[type];
        return rtnArr && rtnArr[index || 0];
      },
      getAll: function (type) {
        return this.rtn[type];
      },
      count: function (type) {
        if (!type)
          return args.length;
        var rtnArr = this.rtn[type];
        return rtnArr && rtnArr.length || 0;
      }
    }
    return new ParamRtn(args);
  }

  //merge objects
  function extend() {
    var other = slice.call(arguments),
      tar = other.splice(0, 1).shift();
    each(other, function (arg) {
      if (arg instanceof NodeList)
        tar.length = arg.length;
      each(arg, function (value, key) {
        tar[key] = value;
      });
    }, true);
    return tar;
  }

  //polyfill of matches
  function match(selector, dom) {
    var _match = dom.matches;
    if (_match)
      return _match(selector);
    var matches = (dom.document || dom.ownerDocument).querySelectorAll(selector);
    var i = 0;
    while (matches[i] && matches[i] !== dom) {
      i++;
    }
    return matches[i] ? true : false;
  }

  var IS_SIMPLE_NUMBER = /^\d*\.?\d*$/;
  proto.data = function (key, value) {
    if (value === undefined) {
      var rtn = this.dataset[key];
      switch (rtn) {
        case "true":
          return r(true);
        case "false":
          return r(false);
      }
      if (IS_SIMPLE_NUMBER.test(rtn)) {
        return r(Number(rtn));
      }
      return r(rtn);
    }
    this.dataset[key] = value;
  }
  //仅支持到单wrapper
  proto.wrap = function (arg) {
    if (typeOf(arg) == "string") {
      //TODO
    } else if (typeOf(arg) == "function") {
      //TODO
    } else if (arg instanceof $) {
      var parent = this.parentElement;
      parent.replaceChild(arg[0], this);
      arg[0].appendChild(this);
      return r($(parent));
    }
  }
  proto.html = function (html) {
    this.innerHTML = html;
  }
  proto.attr = function (key, value) {
    if (value === undefined) {
      return r(this.getAttribute(key));
    }
    this.setAttribute(key, value);
  }
  proto.parent = function () {
    //TODO if this is top element
    return r($(this.parentElement));
  };
  function resize(fn) {
    bind((this == $) ? window : this, "resize", fn);
  }


  function curry(method, key,cb) {
    return function (value) {
      var rtn = method.call(this, key, value);
      if(rtn){
        if(cb){
          return r(cb(rtn.rtn));
        }
        return rtn;
      }
    }
  }
  function cssCurryCB(rtn){
      return parseInt(rtn);
  }
  proto.width = curry(css, 'width',cssCurryCB);
  proto.height = curry(css, 'height',cssCurryCB);
  proto.resize = resize;
  proto.load = function (fn) {
    bind((this == $) ? window : this, "load", fn);
  };
  proto.id = curry(proto.attr, "id");
  function r(data) {
    return {rtn: data};
  }

  //support each and chain call
  function chainify(prototype) {
    each(prototype, function (protoFunc, protoName, proto) {
      proto[protoName] = function () {
        var rtn;
        if (this.length > 1) {
          each(this, function (dom, index, $obj) {
            rtn = protoFunc.apply(dom, arguments);
            if (rtn)
              return rtn.rtn;
          });
        } else if (this.length == 1) {
          rtn = protoFunc.apply(this[0], arguments);
        }
        return rtn && rtn.rtn || this;
      }
    });
    return prototype;
  }

  chainify(proto);
  //expose api
  extend($, {
    each: each,
    extend: extend,
    params: params,
    resize: resize
  });
  $.fn = {
    extend: function (obj) {
      extend(proto, chainify(obj));
    }
  }
  window.$ = $;
  if (typeof define === "function" && define.amd) {
    define("$", [], function () {
      return $;
    });
  }
})()
