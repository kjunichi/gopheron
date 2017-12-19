"use strict";

function gopheronMain(golangMode) {

  function setupText(msg) {
    const ww = 300;
    const hh = 50;
    console.log(`setupText ${msg}`)
    const ctx = cs.getContext("2d");
    //ctx.globalAlpha = 0.0;
    ctx.clearRect(0, 0, cs.width, cs.height);
    ctx.fillStyle = "rgb(245, 245, 245)";
    ctx.fillRect(0, 0, cs.width, cs.height - hh);
    ctx.beginPath();
    ctx.moveTo(0 + ww, cs.height - hh);
    ctx.lineTo(cs.width - ww, cs.height - hh);
    ctx.lineTo(cs.width / 2, cs.height);
    ctx.closePath();
    ctx.fill();
    /* フォントスタイルを定義 */
    ctx.font = "26px 'ＭＳ Ｐゴシック'";

    ctx.strokeStyle = "blue";
    ctx.fillStyle = "rgb(0, 0, 225)";

    ctx.fillText(msg, 4, 40);
  }

  function makeGopherBoard() {
    const gopherBoard = new THREE.PlaneGeometry(512, 256, 1, 1);
    texture = new THREE.Texture(cs, THREE.UVMapping, THREE.ClampToEdgeWrapping, THREE.ClampToEdgeWrapping);
    setupText("...");
    const gopherBoardMaterial = new THREE.MeshBasicMaterial({
      map: texture,
      overdraw: true,
      color: 0xffffff,
      wireframe: false //true
    });

    return new THREE.Mesh(gopherBoard, gopherBoardMaterial);
  }

  function createGopher() {
    console.log(`createGopher start`);
    console.log(`${gopherHRMesh}, ${gopherERMesh}, ${gopherEarRMesh} ${gopherFRMesh}, ${gopherHLMesh}, ${gopherELMesh}, ${gopherEarLMesh}, ${gopherFLMesh}, ${gopherBodyMesh}`)
    if (gopherHRMesh && gopherERMesh &&
      gopherEarRMesh && gopherFRMesh &&
      gopherHLMesh && gopherELMesh &&
      gopherEarLMesh && gopherFLMesh &&
      gopherBodyMesh) {

      root.add(gopherBodyMesh);

      root.add(rootEarR);
      root.add(rootEarL);

      root.add(rootER);
      root.add(rootEL);

      root.add(rootHR);
      root.add(rootHL);

      root.add(rootFR);
      root.add(rootFL);

      scene.add(root);

      gopher();
    }
  }

  function addParts(obj, geom, material, scale) {
    geom.computeFaceNormals();
    geom.computeVertexNormals();

    geom.computeBoundingBox();
    const bb = geom.boundingBox;
    const v = new THREE.Vector3();
    v.addVectors(bb.min, bb.max);
    v.multiplyScalar(0.5);
    v.multiplyScalar(scale);
    obj.position.add(v);
    geom.center();
    const mesh = new THREE.Mesh(geom, material);
    mesh.scale.set(scale, scale, scale);
    obj.add(mesh);
    return mesh;
  }



  function gopher() {

    root.position.x = -1000;
    root.position.y = -500;
    root.rotation.y = -0.8;

    let accx = 1;
    let isJumpping = false;
    let accy = 1;
    let sHR = 1;
    let sHL = -1;

    const animate = () => {
      if (root.position.x > 1000) {
        accx = -1;
        root.rotation.y = -2.8;
      }
      if (root.position.x < -1000) {
        accx = 1;
        root.rotation.y = -0.8;
      }

      if (isJumpping) {
        gopherFRMesh.rotation.x = -Math.PI / 2;
        gopherFLMesh.rotation.x = -Math.PI / 2;
        gopherHRMesh.rotation.z = Math.PI / 2;
        gopherHLMesh.rotation.z = Math.PI / 2;
        root.position.y += 15 * accy;
        if (root.position.y > -200) {
          accy = -1;
        }
        if (root.position.y < -500) {
          accy = 1;
          root.position.y = -500;
          isJumpping = false;
        }
      } else {
        gopherFRMesh.rotation.x = 0;
        gopherFLMesh.rotation.x = 0;
        if (Math.random() > 0.98 && gopherMove) {
          isJumpping = true;
        }
      }

      if (gopherMove) {
        root.position.x = root.position.x + accx * 4;
      }
      gopherBoardMesh.position.x = root.position.x;
      gopherBoardMesh.position.z = root.position.z;
      gopherBoardMesh.position.y = root.position.y + 530;

      gopherFLMesh.position.y += (Math.random() - 0.5) * 8;
      if (gopherFLMesh.position.y > 20) {
        gopherFLMesh.position.y = 20;
      }
      if (gopherFLMesh.position.y < 0) {
        gopherFLMesh.position.y = 0;
      }
      gopherFRMesh.position.y += (Math.random() - 0.5) * 8;
      if (gopherFRMesh.position.y > 20) {
        gopherFRMesh.position.y = 20;
      }
      if (gopherFRMesh.position.y < 0) {
        gopherFRMesh.position.y = 0;
      }
      gopherHRMesh.position.y += (Math.random() - 0.5) * 4;
      if (gopherHRMesh.position.y > 20) {
        gopherHRMesh.position.y = 20;
      }
      if (gopherHRMesh.position.y < -10) {
        gopherHRMesh.position.y = -10;
      }

      gopherHRMesh.rotation.z += sHR * 0.14;
      if (gopherHRMesh.rotation.z < -0.5) {
        gopherHRMesh.position.z = -0.5;
        sHR = 1;
      }
      if (gopherHRMesh.rotation.z > 1.0) {
        gopherHRMesh.position.z = 1.0;
        sHR = -1;
      }
      gopherHLMesh.rotation.z += sHL * 0.14;
      if (gopherHLMesh.rotation.z < -0.5) {
        gopherHLMesh.position.z = -0.5;
        sHL = 1;
      }
      if (gopherHLMesh.rotation.z > 1.0) {
        gopherHLMesh.position.z = 1.0;
        sHL = -1;
      }
      gopherHLMesh.position.y += (Math.random() - 0.5) * 4;
      if (gopherHLMesh.position.y > 20) {
        gopherHLMesh.position.y = 20;
      }
      if (gopherHLMesh.position.y < -10) {
        gopherHLMesh.position.y = -10;
      }

      gopherELMesh.rotation.x += (0.5 - Math.random()) * 0.2;
      if (gopherELMesh.rotation.x > 0.5) {
        gopherELMesh.rotation.x = 0.5
      }
      if (gopherELMesh.rotation.x < -0.5) {
        gopherELMesh.rotation.x = -0.5
      }
      gopherERMesh.rotation.x += (0.5 - Math.random()) * 0.2;
      if (gopherERMesh.rotation.x > 0.5) {
        gopherERMesh.rotation.x = 0.5
      }
      if (gopherERMesh.rotation.x < -0.5) {
        gopherERMesh.rotation.x = -0.5
      }
      renderer.render(scene, camera);
      // //console.log(renderer.domElement);
      // const sctx = renderer.domElement.getContext("webgl");
      // //console.log(sctx);
      // const pdata =  new Uint8Array(4*cs3.width*cs3.height);
      // sctx.readPixels(0,0,sctx.drawingBufferWidth,sctx.drawingBufferHeight,sctx.RGBA,sctx.UNSIGNED_BYTE,pdata);
      // const dctx = cs3.getContext("2d");
      // const image = dctx.getImageData(0,0,sctx.drawingBufferWidth,sctx.drawingBufferHeight);
      // for(let y=0;y < sctx.drawingBufferHeight;y++){
      //   for(let x=0; x < sctx.drawingBufferWidth;x++) {
      //     image.data[4*((cs3.height-y)*cs3.width+x)+0] = pdata[4*(y*cs3.width+x)+0];
      //     image.data[4*((cs3.height-y)*cs3.width+x)+1] = pdata[4*(y*cs3.width+x)+1];
      //     image.data[4*((cs3.height-y)*cs3.width+x)+2] = pdata[4*(y*cs3.width+x)+2];
      //     image.data[4*((cs3.height-y)*cs3.width+x)+3] = pdata[4*(y*cs3.width+x)+3];
      //   }
      // }
      // //for(let i =0;i< 4*width*height;i++){
      //   //image.data[4*width*height-i]=pdata[i];
      // //}
      // dctx.putImageData(image,0,0);
      requestAnimationFrame(animate);
    }
    animate();
    if (golangMode) {
      socket.emit('gopher', 'ok');
    }
  }
  let texture;
  const cs = document.createElement("canvas");
  cs.width = 512;
  cs.height = 256;
  const cs2 = document.createElement("canvas");
  cs2.width = cs.width;
  cs2.height = cs.height;

  const gopherBoardMesh = makeGopherBoard();

  const width = window.innerWidth * 0.98;
  const height = window.innerHeight * 0.98;
  // シーン
  const scene = new THREE.Scene();
  //scene.fog = new THREE.FogExp2(0x000000, 0.00035);
  // カメラ
  const camera = new THREE.PerspectiveCamera(50, width / height, 1, 10000);
  camera.position.z = 1400;
  camera.position.y = 200;
  //camera.rotation.z = 0.2;
  camera.lookAt(new THREE.Vector3(0,200,0));
  //console.dir(camera);
  // 光源
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
  directionalLight.position.set(1, 1, 2);
  scene.add(directionalLight);
  // 環境光
  const ambientLight = new THREE.AmbientLight(0xdddddd);
  scene.add(ambientLight);
  // レンダラー
  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    preserveDrawingBuffer: false
  });
  renderer.setSize(width, height);
  //
  document.body.appendChild(renderer.domElement);
  // const cs3 = document.createElement("canvas");
  // cs3.width = width;
  // cs3.height = height;
  // document.body.appendChild(cs3);
  // モデル
  //オブジェクト

  let gopherHRMesh;
  let gopherERMesh;
  let gopherEarRMesh;
  let gopherFRMesh;
  let gopherHLMesh;
  let gopherELMesh;
  let gopherEarLMesh;
  let gopherFLMesh;
  let gopherBodyMesh;

  const root = new THREE.Object3D();
  const rootEL = new THREE.Object3D();
  const rootER = new THREE.Object3D();
  const rootEarL = new THREE.Object3D();
  const rootEarR = new THREE.Object3D();
  const rootHL = new THREE.Object3D();
  const rootHR = new THREE.Object3D();
  const rootFL = new THREE.Object3D();
  const rootFR = new THREE.Object3D();

  const loader = new THREE.JSONLoader();
  loader.load('./models/gopher_slimdataHR.json', (geometry, materials) => {
    gopherHRMesh = addParts(rootHR, geometry, materials, 40);
    createGopher();
  });

  loader.load('./models/gopher_slimdataHL.json', (geometry, materials) => {
    gopherHLMesh = addParts(rootHL, geometry, materials, 40);
    createGopher();
  });
  loader.load('./models/gopher_slimdataER.json', (geometry, materials) => {
    gopherERMesh = addParts(rootER, geometry, materials, 40);
    createGopher();
  });
  loader.load('./models/gopher_slimdataEL.json', (geometry, materials) => {
    gopherELMesh = addParts(rootEL, geometry, materials, 40);
    createGopher();
  });
  loader.load('./models/gopher_slimdataFR.json', (geometry, materials) => {
    gopherFRMesh = addParts(rootFR, geometry, materials, 40);
    createGopher();
  });
  loader.load('./models/gopher_slimdataFL.json', (geometry, materials) => {
    gopherFLMesh = addParts(rootFL, geometry, materials, 40);
    createGopher();
  });
  loader.load('./models/gopher_slimdataEarR.json', (geometry, materials) => {
    gopherEarRMesh = addParts(rootEarR, geometry, materials, 40);
    createGopher();
  });
  loader.load('./models/gopher_slimdataEarL.json', (geometry, materials) => {
    gopherEarLMesh = addParts(rootEarL, geometry, materials, 40);
    createGopher();
  });
  loader.load('./models/gopher_slimdataBody.json', (geometry, materials) => {
    geometry.computeFaceNormals();
    geometry.computeVertexNormals();
    gopherBodyMesh = new THREE.Mesh(geometry, materials);
    gopherBodyMesh.scale.set(40, 40, 40);

    createGopher();
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
  let socket;
  let gopherMove = true;
  if (golangMode) {
    socket = io('http://localhost:5050');
    socket.on('news', (data) => {
      setupText(data);
      scene.add(gopherBoardMesh);
      texture.needsUpdate = true;
      setTimeout(() => {
        scene.remove(gopherBoardMesh);
      }, 15000);
    });
    socket.on('stop', (data) => {
      gopherMove = false;
      setTimeout(() => {
        gopherMove = true;
      }, 30000)
    });
    console.log(`golangMode = ${golangMode}`)
  }
}

function checkGolangMode(next) {
  const h = window.location.search.slice(1).split("&");
  const golangMode = Boolean(h[0].split("=")[1] === "true");
  if (golangMode) {
    const s = document.createElement("script");
    s.src = "http://localhost:5050/socket.io.js";
    s.onload = () => {
      next(golangMode);
    };
    document.body.appendChild(s);
  } else {
    next(false);
  }
}

checkGolangMode(gopheronMain);