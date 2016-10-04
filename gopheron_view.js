"use strict";

const socket = io('http://localhost:5050');

const cs = document.createElement("canvas");
cs.width = 2048;
cs.height = 2048;
const cs2 = document.createElement("canvas");
cs2.width = cs.width;
cs2.height = cs.height;

const gopherBoard = new THREE.PlaneGeometry(600, 300, 1, 1);
const texture = new THREE.Texture(cs, THREE.UVMapping, THREE.ClampToEdgeWrapping, THREE.ClampToEdgeWrapping);
setupTest("...");
const gopherBoardMaterial = new THREE.MeshBasicMaterial({
  map: texture,
  overdraw: true,
  //color: 0x000000,
  wireframe: false //true
});
const gopherBoardMesh = new THREE.Mesh(gopherBoard, gopherBoardMaterial);

function setupTest(msg) {
  console.log(`setupTest ${msg}`)
  const ctx = cs.getContext("2d");
  ctx.clearRect(0, 0, cs.width, cs.height);
  ctx.fillStyle = "rgb(245, 245, 245)";
  ctx.fillRect(0, 0, cs.width, cs.height - 300);
  ctx.beginPath();
  ctx.moveTo(0 + 600, cs.height - 300);
  ctx.lineTo(cs.width - 600, cs.height - 300);
  ctx.lineTo(cs.width / 2, cs.height);
  ctx.closePath();
  ctx.fill();
  /* フォントスタイルを定義 */
  ctx.font = "132px 'ＭＳ Ｐゴシック'";

  ctx.strokeStyle = "blue";
  ctx.fillStyle = "rgb(0, 0, 225)";
  //ctx.strokeText(msg, 2, 310);
  ctx.fillText(msg, 2, 310);
  //const ctx2 = cs.getContext("2d");
  //ctx2.putImageData(ctx.getImageData(0,0,cs.width,cs.height),0, 0);
  
}

gopherBoardMesh.position.y = 200;
gopherBoardMesh.position.z = 1000;


const width = window.innerWidth * 0.98;
const height = window.innerHeight * 0.98;
// シーン
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x000000, 0.00035);
// カメラ
const camera = new THREE.PerspectiveCamera(50, width / height, 1, 10000);
camera.position.z = 1400;
camera.position.y = 200;
//camera.rotation.z = 0.2;
camera.lookAt(0);
//console.dir(camera);
// 光源
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(200, 200, 200);
scene.add(directionalLight);
// 環境光
const ambientLight = new THREE.AmbientLight(0x999999);
scene.add(ambientLight);
// レンダラー
const renderer = new THREE.WebGLRenderer({
  alpha: true,
  preserveDrawingBuffer: true
});
renderer.setSize(width, height);
//
document.body.appendChild(renderer.domElement);

// モデル
//オブジェクト
const loader = new THREE.JSONLoader();

loader.load('./gopher3.json', function (geometry, materials) {
  //loader.load('./testobj3.json', function(geometry,materials) {
  const faceMaterial = new THREE.MeshFaceMaterial(materials);
  const gopherMesh = new THREE.Mesh(geometry, faceMaterial);
  //mesh = new THREE.Mesh(geometry);

  gopherMesh.scale.set(40, 40, 40);
  gopherMesh.position.x = -1000;
  gopherMesh.position.y = -500;
  gopherMesh.rotation.y = -0.8;
  scene.add(gopherMesh);
  let accx = 1;
  let isJumpping = false;
  let accy = 1;
  const animate = () => {
    if (gopherMesh.position.x > 1000) {
      accx = -1;
      gopherMesh.rotation.y = -2.8;
    }
    if (gopherMesh.position.x < -1000) {
      accx = 1;
      gopherMesh.rotation.y = -0.8;
    }

    if (isJumpping) {
      gopherMesh.position.y += 15 * accy;
      if (gopherMesh.position.y > -200) {
        accy = -1;
      }
      if (gopherMesh.position.y < -500) {
        accy = 1;
        gopherMesh.position.y = -500;
        isJumpping = false;
      }
    } else {
      if (Math.random() > 0.98) {
        isJumpping = true;
      }
    }
    gopherMesh.position.x = gopherMesh.position.x + accx * 4;
    gopherBoardMesh.position.x = gopherMesh.position.x;
    gopherBoardMesh.position.z = gopherMesh.position.z;
    gopherBoardMesh.position.y = gopherMesh.position.y + 500;
    //setTimeout(meshMoveFunc, 100);
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  }
  animate();
  socket.emit('gopher', 'ok');
});

//グリッド
const planeGeometry = new THREE.PlaneGeometry(1000, 1000, 10, 10);
const planeMaterial = new THREE.MeshBasicMaterial({
  color: 0x000000,
  wireframe: true
});
const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
planeMesh.position.y = -100;
planeMesh.rotation.x = 90 * 2 * Math.PI / 360; //左に角度いれるとラジアンに変換

socket.on('news', (data) => {
  setupTest(data);
  scene.add(gopherBoardMesh);
  texture.needsUpdate = true;
  //renderer.render(scene, camera);
  setTimeout(() => {
    scene.remove(gopherBoardMesh);
  }, 15000);
});
