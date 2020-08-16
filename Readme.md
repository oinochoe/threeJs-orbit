# ThreeJS example study

## RayCaster

```md
광선 투사(Ray casting)는 컴퓨터 그래픽스와 계산기하학의 다양한 문제를 해결하기 위해 광선과 표면의 교차검사를 사용하는 기법을 말한다.
# threejs
이 클래스는 레이 캐스팅을 지원하도록 설계되었습니다.
레이 캐스팅은 무엇보다도 마우스 피킹 (마우스가 3D 공간에있는 물체를 파악)에 사용됩니다.
```

## PerspectiveCamera
원근감 표현

```md
PerspectiveCamera( fov : Number, aspect : Number, near : Number, far : Number )
fov — Camera frustum vertical field of view.  카메라 절두체 수직 시야각 (도). 기본값은 50입니다.
aspect — Camera frustum aspect ratio.  카메라 절두체 종횡비, 일반적으로 캔버스 너비 / 캔버스 높이입니다. 기본값은 1 (정사각형 캔버스)입니다.
near — Camera frustum near plane.  평면 근처의 카메라 절두체. 기본값은 0.1입니다.
far — Camera frustum far plane. 카메라 절두체 먼 평면. 기본값은 2000입니다.
```
