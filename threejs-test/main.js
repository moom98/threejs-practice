import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

let scene, camera, renderer, pointLight;

// ページの読み込みを待ってからレンダリングする
window.addEventListener('load', init);

function init() {
  // シーンを追加
  scene = new THREE.Scene();

  // カメラを追加
  // PerspectiveCamera(画角, アスペクト比, near(開始距離), far(終了距離))
  camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
    );
    // カメラの位置を設定
    camera.position.set(0, 0, 500);


    // レンダラーを追加
    // alpha: true で背景を透過
    renderer = new THREE.WebGLRenderer({alpha: true});
    // 画面いっぱいにレンダラーを表示
renderer.setSize(window.innerWidth, window.innerHeight);
// 球体のデバイスピクセル比を設定（解像度を調整する）
renderer.setPixelRatio(window.devicePixelRatio);
// index.htmlにレンダラーのDOM要素を追加
document.body.appendChild(renderer.domElement);


// 球体にテクスチャを追加
let textures = new THREE.TextureLoader().load('../images/earth.jpg');

// ジオメトリ（骨格）を作成
// SphereGeometry(半径, 横方向の分割数, 縦方向の分割数)
let ballGeometry = new THREE.SphereGeometry(100, 64, 32);

// マテリアルを作成
let ballMaterial = new THREE.MeshPhysicalMaterial({map: textures});

// メッシュ化（ジオメトリとマテリアルを組みあわせる）
let ballMesh = new THREE.Mesh(ballGeometry, ballMaterial);
scene.add(ballMesh);


// 並行光源を追加する
let directionalLight = new THREE.DirectionalLight(0xffffff, 2);
directionalLight.position.set(1, 1, 1);
scene.add(directionalLight);

// ポイント光源を追加する
pointLight = new THREE.PointLight(0xf0f0f0, 1, 1000);
pointLight.position.set(0, 0, 500);
scene.add(pointLight);

// ポイント光源の位置を特定するヘルパー要素を表示する
// PointLightHelper(光源, サイズ)
let pointLightHelper = new THREE.PointLightHelper(pointLight, 30);
scene.add(pointLightHelper);


// カメラコントローラーを追加する（マウスで操作できるようにする）
// OrbitControls(カメラ, レンダラーのDOM要素)
let controls = new OrbitControls(camera, renderer.domElement);

window.addEventListener('resize', onWindowResize);

animate();
}

// ブラウザのリサイズに対応させる
function onWindowResize() {
  // レンダラーのサイズを常に画面サイズに合わせる
  renderer.setSize(window.innerWidth, window.innerHeight);

  // カメラのアスペクト比も画面サイズに合わせる
  camera.aspect = window.innerWidth / window.innerHeight;
  // カメラのアスペクト比を変更する際は必ずupdateProjectionMatrix()を呼び出す
  camera.updateProjectionMatrix();
}


// ポイント光源が球の周りを動くようにする
function animate() {
  pointLight.position.set(
    200 * Math.sin(Date.now() / 500),
    200 * Math.sin(Date.now() / 1000),
    200 * Math.cos(Date.now() / 500),
    );

    // レンダリングする
    renderer.render(scene, camera);

    // アニメーションさせる
    requestAnimationFrame(animate);
  }