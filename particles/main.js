import * as THREE from "./build/three.module.js";
import { OrbitControls } from "./controls/OrbitControls.js";
import GUI from "https://cdn.jsdelivr.net/npm/lil-gui@0.15/+esm";

//UIデバッグ
const gui = new GUI();

//サイズ
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

//シーン
const scene = new THREE.Scene();

//カメラ
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.set(1, 1, 2);

//レンダラー
const renderer = new THREE.WebGLRenderer();
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

/**
 * テクスチャ設定
 */
 
// テクスチャローダー
const textureLoader = new THREE.TextureLoader();
const particlesTexture = textureLoader.load('./textures/particles/9.png');

/**
 * パーティクル
 */

// ジオメトリ
const particlesGeometry =new THREE.BufferGeometry();
const count = 5000;
const colorArray = new Float32Array(count * 3); // 色情報は3つで表現されるので、3をかける

// 頂点座標
const positions = new Float32Array(count * 3); // 点はxyzの3つで表現されるので、3をかける
for (let i = 0; i < count * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 10; // -5 ~ 5の間のランダムな数値
    colorArray[i] = Math.random(); // 0 ~ 1の間のランダムな数値の色を当てる
}
// 頂点座標を設定
// BufferAttributeは頂点の属性を表すクラス
particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));

// 深度テストのために球を作る
const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(),
    new THREE.MeshBasicMaterial()
);
// scene.add(sphere);

// マテリアル
const  pointMaterial = new THREE.PointsMaterial({
    size: 0.15,
    sizeAttenuation: true, // カメラから見たときに遠近法が効く、デフォルトでtrue
    alphaMap: particlesTexture, // 透明度を設定するテクスチャ
    transparent: true, // 透明にする
    // alphaTest: 0.001, // 透明度の閾値、0 ~ 1の間で設定（テクスチャのエッジをなめらかにする）
    // depthTest: false, // 深度をテストするかどうか
    depthWrite: false, // 深度を書き込むかどうか
    vertexColors: true, // 頂点座標の色を有効にする
    blending: THREE.AdditiveBlending, // 加算合成（彩度・明度が上がる）
});
// pointMaterial.map = particlesTexture; // テクスチャを設定
// pointMaterial.color.set('green'); // 色を設定

// メッシュ化
// Pointsクラスを使うと、ジオメトリの頂点を一つ一つに対してマテリアルを適用できる
const particlesMesh = new THREE.Points(particlesGeometry, pointMaterial);

scene.add(particlesMesh);

//マウス操作
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

window.addEventListener("resize", onWindowResize);

const clock = new THREE.Clock();

function animate() {
  const elapsedTime = clock.getElapsedTime();

  controls.update();
  
  // パーティクルアニメーション
  for(let i = 0; i < count; i++) {
    const i3 = i * 3;

    // 頂点座標の配列が[x,y,z] = [0,1,2]のように並んでいるので、
    // x座標はarray[i3 + 0]、y座標はarray[i3 + 1]、z座標はarray[i3 + 2]となる
    // sin関数を使って各座標を変化させる
    const x = particlesGeometry.attributes.position.array[i3 + 0] = Math.sin(elapsedTime + i * 0.1) * 0.5;
    // particlesGeometry.attributes.position.array[i3 + 1] = Math.sin(elapsedTime + i * 0.1) * 0.5;
    particlesGeometry.attributes.position.array[i3 + 1] = Math.sin(elapsedTime + x) ;
  }

  // y座標を更新 
  particlesGeometry.attributes.position.needsUpdate = true;

  //レンダリング
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

//ブラウザのリサイズに対応
function onWindowResize() {
  renderer.setSize(sizes.width, sizes.height);
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
}

animate();
