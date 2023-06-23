import * as THREE from "./build/three.module.js";
import { OrbitControls } from "./controls/OrbitControls.js";

//シーン
const scene = new THREE.Scene();

//カメラ
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
camera.position.set(1, 1, 2);

//レンダラー
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
document.body.appendChild(renderer.domElement);

/**
 * ジオメトリを作ってみよう。
 **/
// 立方体
// BoxGeometry(幅, 高さ, 奥行き)：引数は任意
const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
// const boxGeometry = new THREE.BoxGeometry(1, 1, 1,10,10,10);

// 球体
// SphereGeometry(半径, 横方向の分割数, 縦方向の分割数)
const sphereGeometry = new THREE.SphereGeometry(0.5,32,16);

// 平面
// PlaneGeometry(幅, 高さ)：引数は任意
const planeGeometry = new THREE.PlaneGeometry(10, 10);

// ドーナツ型
// TorusGeometry(半径, 管の太さ, 横方向の分割数, 縦方向の分割数)
const torusGeometry = new THREE.TorusGeometry(0.5, 0.2, 16, 32);

// バッファジオメトリ
const bufferGeometry = new THREE.BufferGeometry();

// バッファジオメトリで三角形を作る
// 型付き配列を作る
const count = 50;
const positionArr = new Float32Array(9 * count);

// // 頂点座標を代入する
// positionArr[0] = 0; // x座標
// positionArr[1] = 0; // y座標
// positionArr[2] = 0; // z座標

// positionArr[3] = 1;
// positionArr[4] = 0;
// positionArr[5] = 0;

// positionArr[6] = 0;
// positionArr[7] = 1;
// positionArr[8] = 0;

// 乱数を使って頂点座標を代入する
for(let i = 0; i < count *9; i++) {
  positionArr[i] = (Math.random() - 0.5 * 4);
}

// console.log(positionArr);
// 頂点属性を作る
// BufferAttribute(配列, 1頂点の要素数)
const positionAttribute = new THREE.BufferAttribute(positionArr, 3);

// 頂点属性をバッファジオメトリに登録する
// setAttribute(属性名, 頂点属性)
bufferGeometry.setAttribute("position", positionAttribute);

//マテリアル
const material = new THREE.MeshBasicMaterial(
  {
    wireframe: true,
  }
);

// メッシュ化
const boxMesh = new THREE.Mesh(boxGeometry, material);
const sphereMesh = new THREE.Mesh(sphereGeometry, material);
const planeMesh = new THREE.Mesh(planeGeometry, material);
const torusMesh = new THREE.Mesh(torusGeometry, material);

const bufferMesh = new THREE.Mesh(bufferGeometry, material);

sphereMesh.position.x = 1.5;

// 平面要素を地面代わりに配置
planeMesh.rotation.x = -Math.PI * 0.5;
planeMesh.position.y = -0.5;

torusMesh.position.x = -1.5;

// scene.add(boxMesh, sphereMesh, planeMesh, torusMesh);

scene.add(bufferMesh);

//ライト
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambientLight);

//マウス操作
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

window.addEventListener("resize", onWindowResize);

const clock = new THREE.Clock();

function animate() {
  const elapsedTime = clock.getElapsedTime();
  // console.log(elapsedTime);

  //オブジェクトの回転
  // sphere.rotation.x = elapsedTime;
  // plane.rotation.x = elapsedTime;
  // octahedron.rotation.x = elapsedTime;
  // torus.rotation.x = elapsedTime;

  // sphere.rotation.y = elapsedTime;
  // plane.rotation.y = elapsedTime;
  // octahedron.rotation.y = elapsedTime;

  // torus.rotation.y = elapsedTime;

  controls.update();

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

animate();
