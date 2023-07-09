import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const canvas = document.querySelector("#canvas");

// scene
const scene = new THREE.Scene();

// sizes
const sizes = {
  width: innerWidth,
  height: innerHeight,
};

// camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  3000
);
camera.position.set(0, 500, 1000);
scene.add(camera);

// renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(window.devicePixelRatio);

// images
const urls = [
  "./images/right.png",
  "./images/left.png",
  "./images/up.png",
  "./images/down.png",
  "./images/front.png",
  "./images/back.png",
];

const loader = new THREE.CubeTextureLoader();
scene.background = loader.load(urls);

// controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true; // 慣性

// Create cube render target
const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(128, {
  generateMipmaps: true,
  minFilter: THREE.LinearMipmapLinearFilter,
});

// Create cube camera
const cubeCamera = new THREE.CubeCamera(1, 100000, cubeRenderTarget);
scene.add(cubeCamera);

// object
const material = new THREE.MeshBasicMaterial({
  envMap: cubeCamera.renderTarget.texture,
});
const geometry = new THREE.SphereGeometry(350, 50, 50);
const sphere = new THREE.Mesh(geometry, material);
sphere.position.set(0, 100, 0);
scene.add(sphere);

function animate() {
  controls.update();
  cubeCamera.update(renderer, scene);
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

animate();
