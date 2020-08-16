// 기본 속성들
let scene, camera, renderer, textMesh, parentContainer, texts, textObjsContainer;

var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2(), INTERSECTED;

function setupScene() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 3000);
    camera.position.set(0, 0, 1200);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(devicePixelRatio);
    document.body.appendChild(renderer.domElement);

}

function fti(feet) {
    return feet * 12;
}

function setupCubeBox() {

    let urls = [
        'https://kaiserkeenmon.dev/codepen/threejs/pen1/cubemap2/resized/posx.jpg', 'https://kaiserkeenmon.dev/codepen/threejs/pen1/cubemap2/resized/negx.jpg',
        'https://kaiserkeenmon.dev/codepen/threejs/pen1/cubemap2/resized/posy.jpg', 'https://kaiserkeenmon.dev/codepen/threejs/pen1/cubemap2/resized/negy.jpg',
        'https://kaiserkeenmon.dev/codepen/threejs/pen1/cubemap2/resized/posz.jpg', 'https://kaiserkeenmon.dev/codepen/threejs/pen1/cubemap2/resized/negz.jpg',
    ];
    let loader = new THREE.CubeTextureLoader();
    scene.background = loader.load(urls);
}

function addLight() {
    // LIGHT
    var light = new THREE.PointLight(0xffffff);
    light.position.set(0, 0, 0);
    scene.add(light);
}

function setupControls() {
    // controls

    controls = new THREE.OrbitControls(camera, renderer.domElement);

    controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
    controls.autoRotate = true;
    controls.dampingFactor = 0.04;

    controls.screenSpacePanning = false;

    controls.minDistance = 0;
    controls.maxDistance = 3000;
    controls.enablePan = false;
    controls.autoRotateSpeed = .5;

    controls.maxPolarAngle = Math.PI / 2;

    window.addEventListener('resize', onWindowResize, false);
    document.addEventListener('mousedown', onMouseDown, false);
    document.addEventListener('mousemove', onMouseMove, false);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function onMouseDown(event) {

    mouseEvent(event, "click");

}

function onMouseMove(event) {

    mouseEvent(event, "move");

}

function mouseEvent(event, action) {
    event.preventDefault();

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    raycaster.setFromCamera(mouse, camera);

    for (let i = 0; i < parentContainer.children.length; i++) {
        let children = parentContainer.children[i].children;
        pick(children, action);
    }
}

function pick(arr, action) {
    var intersects = raycaster.intersectObjects(arr);
    if (action == "click") {
        if (intersects.length > 0) {
            for (var i = 0; i < intersects.length; i++) {
                console.log(intersects[i].object.geometry.parameters.text);
                if (intersects[i].object.geometry.parameters.text.toLowerCase() == "family") {
                    window.location.href = "https://kaiserkeenmon.com";
                }
            }
        }
    } else if (action == "move") {
        if (intersects.length > 0) {
            console.log("do move");
            // $('html, body').addClass('pointer');
        } else {
            console.log('dont move');
            setTimeout(function () {
                // $('html, body').removeClass('pointer');
            }, 1000);
        }
    }
}

function add3DText() {

    parentContainer = new THREE.Mesh();
    scene.add(parentContainer);

    setupTextGeometry()
        .then(data => {
            textObjsContainer = data;
            animate();
        })
        .catch(error => console.log(error));

}

function setupTextGeometry() {

    return new Promise((resolve, reject) => {

        var fontLoader = new THREE.FontLoader();

        fontLoader.load('https://kaiserkeenmon.dev/codepen/threejs/pen1/fonts/Tele-Marines_Regular.json', function (font) {

            var textOptions = { size: 40, height: 15, curveSegments: 5, font: font };
            var textobjs = [
                createText("김영민", textOptions),
                createText("검은사막", textOptions),
                createText("하고있을까", textOptions),
                createText("언제쯤?", textOptions)
            ];

            var offsetDistance = 800;

            // east, north, west, souths
            var offsetVectors = [
                new THREE.Vector3(1, 0, 0),
                new THREE.Vector3(0, 0, -1),
                new THREE.Vector3(-1, 0, 0),
                new THREE.Vector3(0, 0, 1)
            ];

            // apply the offset distance to each offsetVector
            offsetVectors.forEach(offsetVector => {
                offsetVector.setLength(offsetDistance);
            });

            // add the offset vectors to each circle to give them their offset starting position
            for (var i = 0; i < textobjs.length; i++) {
                textobjs[i].position.add(offsetVectors[i]);
            }

            textobjs.forEach(t => {
                parentContainer.add(t);
            });

            if (textobjs !== undefined) {
                resolve(textobjs);
            } else {
                reject(error);
            }

        });
    });
}

function createText(t, o) {
    var geo = new THREE.TextGeometry(t, o);
    geo.center();
    var textmaterial = new THREE.MeshBasicMaterial({ color: 0x00e9fa, overdraw: true });
    textMesh = new THREE.Mesh(geo, textmaterial);

    group = new THREE.Object3D();
    group.add(textMesh);

    scene.add(group);

    return group;
}

function animate() {
    requestAnimationFrame(animate);
    controls.update(); // only required if controls.enableDamping = true, or if controls.autoRotate = true
    render();
}

function render() {

    // rotate the parent
    if (parentContainer) {
        parentContainer.rotateY(.001);
    }

    for (let i = 0; i < textObjsContainer.length; i++) {
        var mat = textObjsContainer[i];
        mat.children[0].material.opacity = .5;
        mat.children[0].material.wireframe = true;
        mat.children[0].lookAt(camera.position);
    }

    renderer.render(scene, camera);
}


setupScene();
setupCubeBox();
setupControls();
add3DText();
setTimeout(function(){
render();
}, 10)