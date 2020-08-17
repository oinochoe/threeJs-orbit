# ThreeJS example study

## RayCaster

```md
광선 투사(Ray casting)는 컴퓨터 그래픽스와 계산기하학의 다양한 문제를 해결하기 위해 광선과 표면의 교차검사를 사용하는 기법을 말한다.
.setFromCamera (좌표 : Vector2, 카메라 : 카메라) : null
- coords — 정규화 된 장치 좌표 (NDC)에서 마우스의 2D 좌표 --- X 및 Y 구성 요소는 -1과 1 사이 여야합니다.
- camera — 광선이 시작되어야하는 카메라 새로운 원점과 방향으로 광선을 업데이트합니다.

# threejs
이 클래스는 레이 캐스팅을 지원하도록 설계되었습니다.
레이 캐스팅은 무엇보다도 마우스 피킹 (마우스가 3D 공간에있는 물체를 파악)에 사용됩니다.
```

```javascript
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();

function onMouseMove( event ) {
	// calculate mouse position in normalized device coordinates
	// (-1 to +1) for both components

	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

}

function render() {

	// update the picking ray with the camera and mouse position
	raycaster.setFromCamera( mouse, camera );

	// calculate objects intersecting the picking ray
	var intersects = raycaster.intersectObjects( scene.children );

	for ( var i = 0; i < intersects.length; i++ ) {

		intersects[ i ].object.material.color.set( 0xff0000 );

	}

	renderer.render( scene, camera );

}

window.addEventListener( 'mousemove', onMouseMove, false );

window.requestAnimationFrame(render);
```

## PerspectiveCamera

원근감 표현

```md
PerspectiveCamera( fov : Number, aspect : Number, near : Number, far : Number )
fov — Camera frustum vertical field of view.  카메라 절두체 수직 시야각 (도). 기본값은 50입니다.
aspect — Camera frustum aspect ratio.  카메라 절두체 종횡비, 일반적으로 캔버스 너비 / 캔버스 높이입니다. 기본값은 1 (정사각형 캔버스)입니다.
near — Camera frustum near plane.  평면 근처의 카메라 절두체. 기본값은 0.1입니다.
far — Camera frustum far plane. 카메라 절두체 먼 평면. 기본값은 2000입니다.

updateProjectionMatrix -> 리사이즈시에 이벤트를 추가하여 해당 반응형 값으로 업데이트하게 합니다.
```

## CubeTextureLoader

```javascript
// eample
var scene = new THREE.Scene();
scene.background = new THREE.CubeTextureLoader()
.setPath( 'textures/cubeMaps/' )
.load([
 'px.png',
 'nx.png',
 'py.png',
 'ny.png',
 'pz.png',
 'nz.png'
]);
```

## PointLight

```md
color - (optional) hexadecimal color of the light. Default is 0xffffff (white).
intensity - (optional) numeric value of the light's strength/intensity. Default is 1.

distance - Maximum range of the light. Default is 0 (no limit).
decay - The amount the light dims along the distance of the light. Default is 1. For physically correct lighting, set this to 2.
```

```javascript
var light = new THREE.PointLight( 0xff0000, 1, 100 );
light.position.set( 50, 50, 50 );
scene.add( light );
```

## OrbitControls

```md
.object : Camera

.panSpeed : Float
Speed of panning. Default is 1.

.position0 : Vector3
Used internally by the .saveState : saveStateand .reset : resetmethods.

.rotateSpeed : Float
Speed of rotation. Default is 1.

.screenSpacePanning : Boolean
Defines how the camera's position is translated when panning. If true, the camera pans in screen space.
Otherwise, the camera pans in the plane orthogonal to the camera's up direction.
Default is true for OrbitControls; false for MapControls.

.target0 : Vector3
Used internally by the .saveState : saveStateand .reset : resetmethods.

.target : Vector3
The focus point of the controls, the .object orbits around this. It can be updated manually at any point to change the focus of the controls.

.touches : Object
This object contains references to the touch actions used by the controls.
controls.touches = {
	ONE: THREE.TOUCH.ROTATE,
	TWO: THREE.TOUCH.DOLLY_PAN
}
.zoom0 : Float
Used internally by the .saveState : saveStateand .reset : resetmethods.

.zoomSpeed : Float
Speed of zooming / dollying. Default is 1.

Methods
.dispose () : null
Remove all the event listeners.

.getAzimuthalAngle () : radians
Get the current horizontal rotation, in radians.

.getPolarAngle () : radians
Get the current vertical rotation, in radians.

.reset () : null
Reset the controls to their state from either the last time the .saveState was called, or the initial state.

.saveState () : null
Save the current state of the controls. This can later be recovered with .reset.

.update () : Boolean
Update the controls. Must be called after any manual changes to the camera's transform, or in the update loop if .autoRotate or .enableDamping are set.
```

# MeshBasicMaterial

```md
매개 변수-(선택 사항) 재료의 모양을 정의하는 하나 이상의 속성을 가진 객체.
재료의 모든 속성 (Material에서 상속 된 모든 속성 포함)을 여기에 전달할 수 있습니다.
예외는 16 진수 문자열로 전달할 수있는 속성 색상이며 기본적으로 0xffffff (흰색)입니다.
Color.set (color)는 내부적으로 호출됩니다.
```