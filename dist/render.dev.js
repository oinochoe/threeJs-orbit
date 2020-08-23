"use strict";

// 기본 속성들
var scene;
var camera;
var renderer;
var textMesh;
var parentContainer;
var texts;
var textObjsContainer; // 레이저로 화면을 돌리듯이 면적을 만났을 때 거리와 면적을 계산하는 장치 mousepoint와 같이 사용됨. *README참고*

var raycaster = new THREE.Raycaster(); // 마우스와의 교차점을 나타내는 옵션 INTERSECTED

var mousepoint = new THREE.Vector2(),
    INTERSECTED;
var OPTIONS = {
  camera: {
    cameraPosition: 2000,
    // TODO: localstorage
    cameraRotateSpeed: 1100,
    cameraMaxDistance: 2500,
    cameraWatchAllSection: true
  },
  // TODO: localstorage
  cubeImage: ['./img/image_1.jpg', './img/image_2.jpg', './img/image_3.jpg', './img/image_4.jpg', './img/image_5.jpg', './img/image_6.jpg'],
  textArray: ['검은사막', '섀도우아레나', '검은사막모바일', 'CrimsonDesert', 'Dokev'],
  // TODO: localstorage
  textArrayUrl: ['https://www.kr.playblackdesert.com', 'https://shadowarena.pearlabyss.com', 'https://www.blackdesertm.com', 'https://crimsondesert.pearlabyss.com', 'https://crimsondesert.pearlabyss.com'],
  textOffset: 1200,
  // TODO: localstorage
  textColor: 0xffffff,
  // TODO: localstorage
  textSize: 100,
  // TODO: localstorage
  textHeight: 100,
  // TODO: localstorage
  textAnimationSpeed: 800,
  // TODO: localstorage
  fontUrl: './nanum.json' // TODO: localstorage

} || {}; // Scene 설정

var setupScene = function setupScene() {
  // 기본 Scene 설정
  scene = new THREE.Scene(); // 기본 camera 설정 (PerspectiveCamera를 통해서 원근감 표현) , 1, 카메라 중심점 수치 *README참고*

  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 5000); // 안티앨리어싱 설정으로 WebGL rendering

  renderer = new THREE.WebGLRenderer({
    antialias: true
  }); // 카메라 포지션 설정

  camera.position.set(0, 0, OPTIONS.camera.cameraPosition); // WebGL size 설정

  renderer.setSize(window.innerWidth, window.innerHeight); // 디바이스에 따라 반응하도록 설정

  renderer.setPixelRatio(devicePixelRatio); // WebGL 호출!

  document.body.appendChild(renderer.domElement);
}; // feet 계산하는 함수 실제로 쓰이지 않음
// const fti = (feet) => feet * 12;
// 카메라의 시점에서 육면체를 둘러싸는 뷰를 결정 (6개의 뷰가 필요하다)


var setupCubeBox = function setupCubeBox() {
  var urls = OPTIONS.cubeImage; //CubeTextureLoader를 사용하여 6개의 면을 만든다.

  var loader = new THREE.CubeTextureLoader(); // scene의 background 설정

  scene.background = loader.load(urls);
}; // 빛을 추가한다. (실제로 사용되지 않음)

/* const addLight = () => {
    let light = new THREE.PointLight(0xff0000, 1, 100);
    // 중심점으로 설정하여 내가 보고있는 기점으로 부터 빛이 반사되어 보이도록 설정함..
    light.position.set(50, 50, 50);
    scene.add(light);
}
 */
// OrbitControl 사용


var setupControls = function setupControls() {
  // 기존에 orbitControls에 선언되어있는 controls에 할당
  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true; // 도는 옵션은 autorotation과 enableDamping 중에 옵션이 켜져있어야 돕니다.

  controls.autoRotate = true; // 카메라가 돕니다.

  controls.dampingFactor = 0.04;
  controls.screenSpacePanning = false; // 패닝시에 카메라가 어떻게 보일지 결정

  controls.minDistance = 0;
  controls.enablePan = false; // Math.PI / 2로 설정하면 상단을 볼 수 없다.
  // 리사이즈시에 리사이즈 이벤트 발동, mousedown, mousemove 이벤트도 추가

  window.addEventListener('resize', onWindowResize, false);
  document.addEventListener('mousedown', onMouseDown, false);
  document.addEventListener('mousemove', onMouseMove, false);
}; // 리사이즈 이벤트


var onWindowResize = function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight; // perspective 객체의 속성 - 반응형시에 camera 호출.

  camera.updateProjectionMatrix(); // 렌더러에 사이즈 설정

  renderer.setSize(window.innerWidth, window.innerHeight);
}; // 마우스 이벤트에 할당


var onMouseDown = function onMouseDown(event) {
  return mouseEvent(event, 'click');
};

var onMouseMove = function onMouseMove(event) {
  return mouseEvent(event, 'move');
}; // 마우스 이벤트


var mouseEvent = function mouseEvent(event, action) {
  event.preventDefault(); // 기본 기능 방지

  mousepoint.x = event.clientX / window.innerWidth * 2 - 1;
  mousepoint.y = -(event.clientY / window.innerHeight) * 2 + 1; // .setFromCamera (좌표 : Vector2, 카메라 : 카메라) : null
  // coords — 정규화 된 장치 좌표 (NDC)에서 마우스의 2D 좌표 --- X 및 Y 구성 요소는 -1과 1 사이 여야합니다.
  // camera — 광선이 시작되어야하는 카메라 새로운 원점과 방향으로 광선을 업데이트합니다.

  raycaster.setFromCamera(mousepoint, camera);
  raycaster.setFromCamera(mousepoint, camera); // for 돌면서 pick을 변경해주어서 해당 클릭이나 move 시에 화면 전환을 일으킵니다.

  for (var i = 0; i < parentContainer.children.length; i++) {
    var children = parentContainer.children[i].children;
    pick(children, action);
  }
}; // 화면 전환 pick 호출


var pick = function pick(arr, action) {
  var intersects = raycaster.intersectObjects(arr); // 각 텍스트를 클릭하면

  if (action == 'click') {
    if (intersects.length > 0) {
      for (var i = 0; i < intersects.length; i++) {
        var intersectText = intersects[i].object.geometry.parameters.text;

        if (intersectText == OPTIONS.textArray[0]) {
          window.open(OPTIONS.textArrayUrl[0]);
          return;
        } else if (intersectText == OPTIONS.textArray[1]) {
          window.open(OPTIONS.textArrayUrl[1]);
          return;
        } else if (intersectText == OPTIONS.textArray[2]) {
          window.open(OPTIONS.textArrayUrl[2]);
          return;
        } else if (intersectText == OPTIONS.textArray[3]) {
          window.open(OPTIONS.textArrayUrl[3]);
          return;
        }
      }
    }
  } else if (action == 'move') {
    return;
    /*  if (intersects.length > 0) {
        console.log(intersects)
    } else {
        return;
    } */
  }
}; // 대망의 Text


var add3DText = function add3DText() {
  // 메쉬 형태로 container를 짜는 것을 선언
  parentContainer = new THREE.Mesh();
  scene.add(parentContainer); // 지오메트리 공간을 만든다.

  setupTextGeometry().then(function (data) {
    textObjsContainer = data;
    animate();
  })["catch"](function (error) {
    return console.log(error);
  });
}; // text를 지오메트리로


var setupTextGeometry = function setupTextGeometry() {
  // 프로미스를 반환한다
  return new Promise(function (resolve, reject) {
    var fontLoader = new THREE.FontLoader(); // notosans kr 폰트 로드 // facetypee에서 변환
    // https://gero3.github.io/facetype.js/

    fontLoader.load(OPTIONS.fontUrl, function (font) {
      // textOptions
      var textOptions = {
        size: OPTIONS.textSize,
        height: OPTIONS.textHeight,
        curveSegments: 1,
        font: font
      }; // TODO : 객체 해시맵으로 표현

      var textobjs = [createText(OPTIONS.textArray[0], textOptions), createText(OPTIONS.textArray[1], textOptions), createText(OPTIONS.textArray[2], textOptions), createText(OPTIONS.textArray[3], textOptions), createText(OPTIONS.textArray[4], textOptions)]; // 텍스트들끼리의 거리

      var offsetDistance = OPTIONS.textOffset; // east, north, west, souths
      // TODO : 객체 해시맵으로 표현

      var offsetVectors = [new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 0, -1), new THREE.Vector3(-1, 0, 0), new THREE.Vector3(0, 0, 1), new THREE.Vector3(-1, -1, -1)]; // apply the offset distance to each offsetVector

      offsetVectors.forEach(function (offsetVector) {
        offsetVector.setLength(offsetDistance);
      }); // add the offset vectors to each circle to give them their offset starting position

      for (var i = 0; i < textobjs.length; i++) {
        textobjs[i].position.add(offsetVectors[i]);
      }

      textobjs.forEach(function (t) {
        parentContainer.add(t);
      });

      if (textobjs.length > 0) {
        resolve(textobjs);
      } else {
        reject(error);
      }
    });
  });
}; // text 만들기


var createText = function createText(t, o) {
  var geo = new THREE.TextGeometry(t, o);
  geo.center();
  var textmaterial = new THREE.MeshBasicMaterial({
    color: OPTIONS.textColor,
    overdraw: true
  });
  textMesh = new THREE.Mesh(geo, textmaterial);
  var group = new THREE.Object3D();
  group.add(textMesh);
  scene.add(group);
  return group;
};

var animate = function animate() {
  requestAnimationFrame(animate);
  controls.update(); // only required if controls.enableDamping = true, or if controls.autoRotate = true

  render();
}; // 그리기!


var render = function render() {
  if (parentContainer) {
    parentContainer.rotateY(OPTIONS.textAnimationSpeed / 100000);
  }

  for (var i = 0; i < textObjsContainer.length; i++) {
    var mat = textObjsContainer[i];
    mat.children[0].material.opacity = 0.5;
    mat.children[0].material.wireframe = true;
    mat.children[0].lookAt(camera.position); // 카메라 방향으로 보게 함.
  }

  controls.maxDistance = OPTIONS.camera.cameraMaxDistance; // max distance 결정

  controls.autoRotateSpeed = OPTIONS.camera.cameraRotateSpeed / 1000; // 자동으로 카메라가 도는 스피드 결정

  controls.maxPolarAngle = OPTIONS.camera.cameraWatchAllSection ? Math.PI : Math.PI / 2; // 육면체를 어느정도각도까지 보여줄지 결정

  renderer.render(scene, camera);
}; // option add


var gui = new dat.GUI({
  autoPlace: true
});
var cam = gui.addFolder('Camera');
var text = gui.addFolder('text');
cam.add(OPTIONS.camera, 'cameraMaxDistance', 2000, 5000).listen();
cam.add(OPTIONS.camera, 'cameraRotateSpeed', 0, 5000).listen();
cam.add(OPTIONS.camera, 'cameraWatchAllSection', true).listen();
cam.open();
text.add(OPTIONS, 'textAnimationSpeed', 0, 5000).listen();
text.open();
setupScene();
setupCubeBox();
setupControls();
add3DText();