import * as THREE from "./build/three.module.js";
import { OrbitControls } from "./controls/OrbitControls.js";

let scene, camera, renderer, pointLight, controls, sphere, plane, octahedron;

window.addEventListener("load", init);

function init() {
  //シーン
  scene = new THREE.Scene();

  //カメラ
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    100
  );
  camera.position.set(1, 1, 2);

  //レンダラー
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  document.body.appendChild(renderer.domElement);

  /**
   * マテリアルセクション
   */

  // ジオメトリ
  const sphereGeometry = new THREE.SphereGeometry(0.5, 32, 32);
  const planeGeometry = new THREE.PlaneGeometry(1, 1);
  const octahedronGeometry = new THREE.OctahedronGeometry(0.5);

  // テクスチャ
  const texture = new THREE.TextureLoader().load("./textures/brick.jpg");

  // マテリアル
  // const material = new THREE.MeshBasicMaterial(
  //   {
  //     map: texture,
  //   }
  // );

  // const material = new THREE.MeshBasicMaterial();
  // material.map = texture;
  // material.color = new THREE.Color("blue");
  // material.wireframe = true;
  // material.side = THREE.DoubleSide;
  // material.opacity = 0.5;
  // material.transparent = true;

  // const material = new THREE.MeshNormalMaterial();
  // material.flatShading = true;

  // const material = new THREE.MeshStandardMaterial();
  // material.color.set("#049ef4");
  // material.map = texture;
  // material.roughness = 0.65;
  // material.metalness = 0.45;

  const material = new THREE.MeshPhongMaterial();
  material.shininess = 100;
  material.specular = new THREE.Color("blue");

  // 明かりを追加する
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
  scene.add(ambientLight);

  const pointLight = new THREE.PointLight(0xffffff, 0.7);
  pointLight.position.set(1, 2, 3);
  scene.add(pointLight);

  const pointLightHelper = new THREE.PointLightHelper(pointLight, 1);
  scene.add(pointLightHelper);


  // メッシュ化
  sphere = new THREE.Mesh(sphereGeometry, material);
  plane = new THREE.Mesh(planeGeometry, material);
  octahedron = new THREE.Mesh(octahedronGeometry, material);

  sphere.position.x = -1.5;
  octahedron.position.x = 1.5;

  scene.add(sphere, plane, octahedron);


  //マウス操作
  const controls = new OrbitControls(camera, renderer.domElement);

  window.addEventListener("resize", onWindowResize);

  animate();
}

const clock = new THREE.Clock();

function animate() {
  // animateが呼ばれてからの経過時間を取得
  const elapsedTime = clock.getElapsedTime();

  // オブジェクトを回転させる
  sphere.rotation.x = 0.5 * elapsedTime;
  plane.rotation.x = 0.5 * elapsedTime;
  octahedron.rotation.x = 0.5 * elapsedTime;

  sphere.rotation.y = 0.5 * elapsedTime;
  plane.rotation.y = 0.5 * elapsedTime;
  octahedron.rotation.y = 0.5 * elapsedTime;



  //レンダリング
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

//ブラウザのリサイズに対応
function onWindowResize() {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
}
