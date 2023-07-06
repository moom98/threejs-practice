import './style.css'
import * as THREE from 'three'
import GUI from "https://cdn.jsdelivr.net/npm/lil-gui@0.15/+esm";

const gui = new GUI();

// scene
const scene = new THREE.Scene();

// size
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

// camera
const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 1000);
camera.position.z = 10;
scene.add(camera);


// renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);


//マウス操作
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

window.addEventListener("resize", onWindowResize);

const clock = new THREE.Clock();

function animate() {
  const elapsedTime = clock.getElapsedTime();

  controls.update();

    //レンダリング
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

window.addEventListener("resize", onWindowResize);

//ブラウザのリサイズに対応
function onWindowResize() {
  renderer.setSize(sizes.width, sizes.height);
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
}