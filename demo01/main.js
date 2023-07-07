import "./style.css";
import * as THREE from "three";
import * as dat from "lil-gui";

// ui debug
const gui = new dat.GUI();

// canvas
const canvas = document.querySelector(".webgl");

// scene
const scene = new THREE.Scene();

// size
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// camera
const camera = new THREE.PerspectiveCamera(
  35,
  sizes.width / sizes.height,
  0.1,
  1000
);
camera.position.z = 6;
scene.add(camera);

// renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(window.devicePixelRatio);
// document.body.appendChild(renderer.domElement);

// object
// material
const material = new THREE.MeshPhysicalMaterial({
  color: "#3c94d7",
  metalness: 0.86,
  roughness: 0.37,
  flatShading: true,
});

gui.addColor(material, "color");
gui.add(material, "metalness").min(0).max(1).step(0.001);
gui.add(material, "roughness").min(0).max(1).step(0.001);

// mesh
const mesh01 = new THREE.Mesh(
  new THREE.TorusGeometry(1, 0.4, 16, 60),
  material
);
const mesh02 = new THREE.Mesh(new THREE.OctahedronGeometry(), material);
const mesh03 = new THREE.Mesh(
  new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16),
  material
);
const mesh04 = new THREE.Mesh(new THREE.IcosahedronGeometry(), material);

// 回転できるように配置する
mesh01.position.set(2, 0, 0);
mesh02.position.set(-1, 0, 0);
mesh03.position.set(2, 0, -6);
mesh04.position.set(5, 0, 3);

scene.add(mesh01, mesh02, mesh03, mesh04);
const meshes = [mesh01, mesh02, mesh03, mesh04];

// particle
const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 700;

const positionArray = new Float32Array(particlesCount * 3);

for (let i = 0; i < particlesCount * 3; i++) {
  positionArray[i] = (Math.random() - 0.5) * 10;
}

particlesGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(positionArray, 3)
);

// particles material
const particlesMaterial = new THREE.PointsMaterial({
  size: 0.025,
  sizeAttenuation: true,
  color: "#ffffff",
});

const particles = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particles);

// light
const light = new THREE.DirectionalLight("#ffffff", 4);
light.position.set(0.5, 1, 0);
scene.add(light);

//ブラウザのリサイズに対応
window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(window.devicePixelRatio);
});

// マウスのホイール操作
let speed = 0;
let rotation = 0;
window.addEventListener("wheel", (e) => {
  speed += e.deltaY * 0.0005;
});

function rot() {
  // 動きに慣性をつける
  rotation += speed;
  speed *= 0.85;

  // mesh01.position.x = rotation;

  // ジオメトリ全体を回転させる
  // (x, z) = (r * cosθ, r * sinθ)
  // 2と-3が中心座標
  // 3.8 = r(半径)
  // rotation = θ(角度)
  // Math.PI = 180度
  // Math.PI / 2 = 90度, Math.PI / 4 = 45度, (3 * Math.PI) / 2 = 270度
  // 各要素を90度ずつずらすことで、4つの要素が正方形配置になる、順に回転させる

  mesh01.position.x = 2 + 3.8 * Math.cos(rotation);
  mesh01.position.z = -3 + 3.8 * Math.sin(rotation);
  mesh02.position.x = 2 + 3.8 * Math.cos(rotation + Math.PI / 2);
  mesh02.position.z = -3 + 3.8 * Math.sin(rotation + Math.PI / 2);
  mesh03.position.x = 2 + 3.8 * Math.cos(rotation + Math.PI);
  mesh03.position.z = -3 + 3.8 * Math.sin(rotation + Math.PI);
  mesh04.position.x = 2 + 3.8 * Math.cos(rotation + (3 * Math.PI) / 2);
  mesh04.position.z = -3 + 3.8 * Math.sin(rotation + (3 * Math.PI) / 2);

  window.requestAnimationFrame(rot);
}

rot();

// カーソルの位置を取得する
const cursor = {
  x: 0,
  y: 0,
};
window.addEventListener("mousemove", (e) => {
  // カーソルの位置を0.5 ~ -0.5に変換する
  cursor.x = e.clientX / sizes.width - 0.5;
  cursor.y = e.clientY / sizes.height - 0.5;
  // console.log(cursor.x, cursor.y);
});

// カーソルが画面外にいるかどうかのフラグ
let cursorInside = true;
window.addEventListener("mouseout", () => {
  cursorInside = false;
});
window.addEventListener("mouseover", () => {
  cursorInside = true;
});

// animation
const clock = new THREE.Clock();
const animate = () => {
  // pcのfpsに合わせる
  let getDeltaTime = clock.getDelta();

  //レンダリング
  renderer.render(scene, camera);

  // メッシュを回転させる
  for (const mesh of meshes) {
    mesh.rotation.x += 0.1 * getDeltaTime;
    mesh.rotation.y += 0.12 * getDeltaTime;
  }

  // カーソルを用いたカメラの制御（カーソルが画面内にあるときのみ）
  if (cursorInside) {
    camera.position.x += cursor.x * getDeltaTime * 1.5;
    camera.position.y += -cursor.y * getDeltaTime * 1.5;
  }

  window.requestAnimationFrame(animate);
};

animate();
