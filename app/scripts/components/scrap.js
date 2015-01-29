define(['util'], function (util) {
  var COLORS = [0x00a0e9, 0xee7500, 0xe50061, 0x009c7a, 0x0aa43d, 0x731485, 0xfed700, 0x006ebc];

  function random(start, end) {
    if (start instanceof Array) {
      return start[random(0, start.length)];
    }
    return Math.floor(Math.random() * (end - start)) + start;
  }


  var camera, scene, renderer;

  var windowHalfX = window.innerWidth / 2;
  var windowHalfY = window.innerHeight / 2;
  var windowBoundY = -windowHalfY - 10;

  //是否暂停及是否继续生成纸片
  var pause = true, more = false;

  var clearTask = null;

  var fps = 0, frameCount = 0, lastTime = new Date;
  //记录场景中首个纸片的index
  var scrapStartIndex = 0;

  function countFPS() {
    frameCount++;
    if (new Date - lastTime >= 1000) {
      fps = frameCount;
      frameCount = 0;
      lastTime = new Date();
    }
  }


  function addScrap() {
    //四个象限(2,4)构成一个四边形或三角形
    var shape = new THREE.Shape();
    shape.moveTo(random(-2, -4), random(-2, -4));
    shape.lineTo(random(2, 4), random(-2, -4));
    shape.lineTo(random(2, 4), random(2, 4));
    if (Math.random() > 0.3) {
      shape.lineTo(random(-2, -4), random(2, 4));
    }
    var geometry = new THREE.ShapeGeometry(shape);
    var color = random(COLORS);
    var mesh = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({
      color: color,
      emissive: color,
      side: THREE.DoubleSide
    }));

    mesh.position.x = random(-windowHalfX, windowHalfX);
    mesh.position.y = random(windowHalfY, windowHalfY - 10);

    mesh.position.next = (function (ratio) {
      return function () {
        this.y -= ratio;
      }
    })(random(10, 20) / 10);
    mesh.rotation.x = random(0, 180);
    mesh.rotation.y = random(0, 2);
    mesh.rotation.next = (function (rotationArch) {
      return function () {
        this.x += rotationArch;
      }
    }(random(4, 8) * 0.01));
    scene.add(mesh);
  }


  function init(id) {
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.set(0, 0, 500);
    scene.add(camera);


    //添加上下左右四个平行光源
    function addLight(x, y, z, a) {
      var light = new THREE.DirectionalLight(0xffffff, a || 0.8);
      light.position.set(x, y, z);
      camera.add(light);
    }

    addLight(0, 1, 0);
    addLight(0, -1, 0);
    addLight(1, 0, 0);
    addLight(-1, 0, 0);
    //var light = new THREE.AmbientLight(0x000000);
    //scene.add(light);

    renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
    renderer.setPixelRatio(window.devicePixelRatio || 1);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById(id).appendChild(renderer.domElement);

    window.addEventListener('resize', onWindowResize, false);

    scrapStartIndex = scene.children.length;
  }

  function onWindowResize() {
    var width = window.innerWidth, height = window.innerHeight;
    windowHalfX = width / 2;
    windowHalfY = height / 2;
    //判断纸片是否需要回收的坐标下边界
    windowBoundY = -windowHalfY - 10;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }


  function render() {
    addScrap();
    var objs = scene.children, i = scrapStartIndex, lim = objs.length;
    for (; i < lim; i++) {
      var mesh = objs[i];
      mesh.rotation.next();
      mesh.position.next();
    }

    renderer.render(scene, camera);
  }

  function animate() {
    if (!pause)
      requestAnimationFrame(animate);
    render();
    countFPS();
  }

  /**
   * 清理不在画布内的纸片
   * @param all 是否清理全部纸片
   */
  function clearScrap(all) {
    var scraps = scene.children.slice(scrapStartIndex);
    scraps.forEach(function (scrap) {
      if (all || scrap.position.y < windowBoundY) {
        scene.remove(scrap);
        scrap.geometry.dispose();
        scrap.material.dispose();
      }
    });
  }


  var rtn = {
    init: init,
    start: function () {
      if (pause || !more) {
        pause = false;
        more = true;
        animate();
      }

      if (clearTask === null) {
        clearTask = setInterval(clearScrap, 10000);
      }
    },
    stop: function () {
      more = false;
      clearInterval(clearTask);
    },
    pause: function () {
      pause = true;
      clearInterval(clearTask);
      clearTask = null;
    },
    clear: function () {
      clearScrap(true);
    },
    fps: function () {
      return fps;
    },
    scrapCount: function () {
      return scene.children.length;
    }
  };

  return util.chainify(rtn);
});
