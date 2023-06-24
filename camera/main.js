import * as THREE from "./build/three.module.js";
import { OrbitControls } from "./controls/OrbitControls.js";

let scene, camera, renderer;
let sphere;

window.addEventListener("DOMContentLoaded", init);

function init() {
  const width = innerWidth;
  const height = innerHeight;

  // シーン
  scene = new THREE.Scene();

  // カメラ
  // PerspectiveCamera(画角(視野角), アスペクト比, near(開始距離), far(終了距離))
  // camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 5000);
  // camera.position.z = 350;

  // OrthographicCamera(左, 右, 上, 下, near(開始距離), far(終了距離))
  const aspectRatio = width / height;
  camera = new THREE.OrthographicCamera(
    500 * aspectRatio,
    -500 * aspectRatio,
    -500,
    500,
    1,
    5000
  );
  camera.position.z = 1000;

  // レンダラー
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(width, height);
  document.body.appendChild(renderer.domElement);

  // 座標軸を表示
  const axes = new THREE.AxesHelper(1500);
  axes.position.x = 0;
  scene.add(axes); //x 軸は赤, y 軸は緑, z 軸は青

  // ボックスを作成
  const geometry = new THREE.SphereGeometry(200, 64, 32);
  const material = new THREE.MeshBasicMaterial({
    color: 0xc7ebb,
    wireframe: true,
  });
  sphere = new THREE.Mesh(geometry, material);
  scene.add(sphere);

  //マウス操作
  new OrbitControls(camera, renderer.domElement);

  window.addEventListener("resize", onWindowResize);
  animate();
}

function animate() {
  requestAnimationFrame(animate);

  sphere.rotation.x += 0.01;
  sphere.rotation.y += 0.01;

  // レンダリング
  renderer.render(scene, camera);
}

function onWindowResize() {
  renderer.setSize(window.innerWidth, window.innerHeight);

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
}
