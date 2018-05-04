'use strict'

let ipcRenderer

try {
  ipcRenderer = require('electron').ipcRenderer
} catch (e) {
  // PWA mode detected.
  console.log(`${e}`)
}

function gopheronMain(golangMode) {

  const drawHthml = (html, texture) => {
    const getWellFormedHtml = (html) => {
      const doc = document.implementation.createHTMLDocument('test')
      const range = doc.createRange()
      range.selectNodeContents(doc.documentElement)
      range.deleteContents()
      const h = document.createElement('head')
      /*
      var css = document.createElement("link")
      css.setAttribute("rel","stylesheet")
      css.setAttribute("type","text/css")
      css.setAttribute("href","http://jsdo.it/kjunichi/hKYA/css")
      h.appendChild(css)
      */
      doc.documentElement.appendChild(h)
      doc.documentElement.appendChild(range.createContextualFragment(html))
      console.log('doc.documentElement.namespaceURI : ' + doc.documentElement.namespaceURI)
      doc.documentElement.setAttribute('xmlns', doc.documentElement.namespaceURI)

      // Get well-formed markup
      const wfHtml = (new XMLSerializer).serializeToString(doc)
      console.log(wfHtml)
      return wfHtml.replace(/<!DOCTYPE html>/, '')
    }

    const wfHtml = getWellFormedHtml(html)
    //console.log(wfHtml)
    const canvas = texture.image
    const svgWidth = canvas.width
    const svgHeight = canvas.height
    const data = `<svg xmlns="http://www.w3.org/2000/svg" width="${svgWidth}" height="${svgHeight}">` +
      `<foreignObject width="110%" height="110%">${wfHtml}</foreignObject></svg>`

    const img = new Image()
    img.onload = () => {
      const ctx = canvas.getContext('2d')
      const ww = 300
      const hh = 50
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      ctx.fillStyle = 'rgb(245, 245, 245)'
      ctx.fillRect(0, 0, canvas.width, canvas.height - hh)
      ctx.beginPath()
      ctx.moveTo(0 + ww, canvas.height - hh)
      ctx.lineTo(canvas.width - ww, canvas.height - hh)
      ctx.lineTo(canvas.width / 2, canvas.height)
      ctx.closePath()
      ctx.fill()

      ctx.drawImage(img, 0, 0, svgWidth, svgHeight, 0, 0, canvas.width, canvas.height)
      texture.needsUpdate = true
    }
    const url = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(data)}`
    img.src = url
  }

  function setupText(msg) {
    const ww = 300
    const hh = 50
    //console.log(`setupText ${msg}`)
    const cs = texture.image
    const ctx = cs.getContext('2d')
    //ctx.globalAlpha = 0.0
    ctx.clearRect(0, 0, cs.width, cs.height)
    ctx.fillStyle = 'rgb(245, 245, 245)'
    ctx.fillRect(0, 0, cs.width, cs.height - hh)
    ctx.beginPath()
    ctx.moveTo(0 + ww, cs.height - hh)
    ctx.lineTo(cs.width - ww, cs.height - hh)
    ctx.lineTo(cs.width / 2, cs.height)
    ctx.closePath()
    ctx.fill()
    /* フォントスタイルを定義 */
    ctx.font = '28px \'ＭＳ Ｐゴシック\''

    ctx.strokeStyle = 'blue'
    ctx.fillStyle = 'rgb(0, 0, 225)'

    ctx.fillText(msg, 4, 40)
  }

  function makeGopherBoard() {
    const cs = document.createElement('canvas')
    cs.width = 512
    cs.height = 256

    const gopherBoard = new THREE.PlaneGeometry(512, 256, 1, 1)
    texture = new THREE.Texture(cs, THREE.UVMapping, THREE.ClampToEdgeWrapping, THREE.ClampToEdgeWrapping)
    setupText('...')
    const gopherBoardMaterial = new THREE.MeshBasicMaterial({
      map: texture,
      overdraw: true,
      color: 0xffffff,
      wireframe: false //true
    })

    return new THREE.Mesh(gopherBoard, gopherBoardMaterial)
  }

  function createGopher() {
    //console.log('createGopher start')
    //console.log(`${gopherHRMesh}, ${gopherERMesh}, ${gopherEarRMesh} ${gopherFRMesh}, ${gopherHLMesh}, ${gopherELMesh}, ${gopherEarLMesh}, ${gopherFLMesh}, ${gopherBodyMesh}`)
    if (gopherHRMesh && gopherERMesh &&
      gopherEarRMesh && gopherFRMesh &&
      gopherHLMesh && gopherELMesh &&
      gopherEarLMesh && gopherFLMesh &&
      gopherBodyMesh) {

      root.add(gopherBodyMesh)

      root.add(rootEarR)
      root.add(rootEarL)

      root.add(rootER)
      root.add(rootEL)

      root.add(rootHR)
      root.add(rootHL)

      root.add(rootFR)
      root.add(rootFL)

      scene.add(root)

      gopher()
    }
  }

  function addParts(obj, geom, material, scale) {
    geom.computeFaceNormals()
    geom.computeVertexNormals()

    geom.computeBoundingBox()
    const bb = geom.boundingBox
    const v = new THREE.Vector3()
    v.addVectors(bb.min, bb.max)
    v.multiplyScalar(0.5)
    v.multiplyScalar(scale)
    obj.position.add(v)
    geom.center()
    const mesh = new THREE.Mesh(geom, material)
    mesh.scale.set(scale, scale, scale)
    obj.add(mesh)
    return mesh
  }

  function gopher() {
    root.position.x = -1000
    root.position.y = -500
    root.rotation.y = -0.8

    let accx = 1
    let isJumpping = false
    let accy = 1
    let sHR = 1
    let sHL = -1

    const animate = () => {
      if (root.position.x > 1000) {
        accx = -1
        root.rotation.y = -2.8
      }
      if (root.position.x < -1000) {
        accx = 1
        root.rotation.y = -0.8
      }

      if (isJumpping) {
        gopherFRMesh.rotation.x = -Math.PI / 2
        gopherFLMesh.rotation.x = -Math.PI / 2
        gopherHRMesh.rotation.z = Math.PI / 2
        gopherHLMesh.rotation.z = Math.PI / 2
        root.position.y += 15 * accy
        if (root.position.y > -200) {
          accy = -1
        }
        if (root.position.y < -500) {
          accy = 1
          root.position.y = -500
          isJumpping = false
        }
      } else {
        gopherFRMesh.rotation.x = 0
        gopherFLMesh.rotation.x = 0
        if (Math.random() > 0.98 && gopherMove) {
          isJumpping = true
        }
      }

      if (gopherMove) {
        root.position.x = root.position.x + accx * 4
      }
      gopherBoardMesh.position.x = root.position.x
      gopherBoardMesh.position.z = root.position.z
      gopherBoardMesh.position.y = root.position.y + 530

      gopherFLMesh.position.y += (Math.random() - 0.5) * 8
      if (gopherFLMesh.position.y > 20) {
        gopherFLMesh.position.y = 20
      }
      if (gopherFLMesh.position.y < 0) {
        gopherFLMesh.position.y = 0
      }
      gopherFRMesh.position.y += (Math.random() - 0.5) * 8
      if (gopherFRMesh.position.y > 20) {
        gopherFRMesh.position.y = 20
      }
      if (gopherFRMesh.position.y < 0) {
        gopherFRMesh.position.y = 0
      }
      gopherHRMesh.position.y += (Math.random() - 0.5) * 4
      if (gopherHRMesh.position.y > 20) {
        gopherHRMesh.position.y = 20
      }
      if (gopherHRMesh.position.y < -10) {
        gopherHRMesh.position.y = -10
      }

      gopherHRMesh.rotation.z += sHR * 0.14
      if (gopherHRMesh.rotation.z < -0.5) {
        gopherHRMesh.position.z = -0.5
        sHR = 1
      }
      if (gopherHRMesh.rotation.z > 1.0) {
        gopherHRMesh.position.z = 1.0
        sHR = -1
      }
      gopherHLMesh.rotation.z += sHL * 0.14
      if (gopherHLMesh.rotation.z < -0.5) {
        gopherHLMesh.position.z = -0.5
        sHL = 1
      }
      if (gopherHLMesh.rotation.z > 1.0) {
        gopherHLMesh.position.z = 1.0
        sHL = -1
      }
      gopherHLMesh.position.y += (Math.random() - 0.5) * 4
      if (gopherHLMesh.position.y > 20) {
        gopherHLMesh.position.y = 20
      }
      if (gopherHLMesh.position.y < -10) {
        gopherHLMesh.position.y = -10
      }

      gopherELMesh.rotation.x += (0.5 - Math.random()) * 0.2
      if (gopherELMesh.rotation.x > 0.5) {
        gopherELMesh.rotation.x = 0.5
      }
      if (gopherELMesh.rotation.x < -0.5) {
        gopherELMesh.rotation.x = -0.5
      }
      gopherERMesh.rotation.x += (0.5 - Math.random()) * 0.2
      if (gopherERMesh.rotation.x > 0.5) {
        gopherERMesh.rotation.x = 0.5
      }
      if (gopherERMesh.rotation.x < -0.5) {
        gopherERMesh.rotation.x = -0.5
      }
      renderer.render(scene, camera)

      requestAnimationFrame(animate)
    }
    animate()
    if (golangMode) {
      socket.emit('gopher', 'ok')
    }
  }
  let texture

  const gopherBoardMesh = makeGopherBoard()

  const width = window.innerWidth * 0.98
  const height = window.innerHeight * 0.98
  // シーン
  const scene = new THREE.Scene()
  //scene.fog = new THREE.FogExp2(0x000000, 0.00035)
  // カメラ
  const camera = new THREE.PerspectiveCamera(50, width / height, 1, 10000)
  camera.position.z = 1400
  camera.position.y = 200
  //camera.rotation.z = 0.2
  camera.lookAt(new THREE.Vector3(0, 200, 0))

  // 光源
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5)
  directionalLight.position.set(1, 1, 2)
  scene.add(directionalLight)
  // 環境光
  const ambientLight = new THREE.AmbientLight(0xdddddd)
  scene.add(ambientLight)
  // レンダラー
  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    preserveDrawingBuffer: false
  })
  // const renderer = new THREE.CanvasRenderer({alpha:true})
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(width, height)
  //
  document.body.appendChild(renderer.domElement)

  // モデル
  //オブジェクト

  let gopherHRMesh
  let gopherERMesh
  let gopherEarRMesh
  let gopherFRMesh
  let gopherHLMesh
  let gopherELMesh
  let gopherEarLMesh
  let gopherFLMesh
  let gopherBodyMesh

  const root = new THREE.Object3D()
  const rootEL = new THREE.Object3D()
  const rootER = new THREE.Object3D()
  const rootEarL = new THREE.Object3D()
  const rootEarR = new THREE.Object3D()
  const rootHL = new THREE.Object3D()
  const rootHR = new THREE.Object3D()
  const rootFL = new THREE.Object3D()
  const rootFR = new THREE.Object3D()

  const loader = new THREE.JSONLoader()
  loader.load('./models/gopher_slimdataHR.json', (geometry, materials) => {
    gopherHRMesh = addParts(rootHR, geometry, materials, 40)
    createGopher()
  })

  loader.load('./models/gopher_slimdataHL.json', (geometry, materials) => {
    gopherHLMesh = addParts(rootHL, geometry, materials, 40)
    createGopher()
  })
  loader.load('./models/gopher_slimdataER.json', (geometry, materials) => {
    gopherERMesh = addParts(rootER, geometry, materials, 40)
    createGopher()
  })
  loader.load('./models/gopher_slimdataEL.json', (geometry, materials) => {
    gopherELMesh = addParts(rootEL, geometry, materials, 40)
    createGopher()
  })
  loader.load('./models/gopher_slimdataFR.json', (geometry, materials) => {
    gopherFRMesh = addParts(rootFR, geometry, materials, 40)
    createGopher()
  })
  loader.load('./models/gopher_slimdataFL.json', (geometry, materials) => {
    gopherFLMesh = addParts(rootFL, geometry, materials, 40)
    createGopher()
  })
  loader.load('./models/gopher_slimdataEarR.json', (geometry, materials) => {
    gopherEarRMesh = addParts(rootEarR, geometry, materials, 40)
    createGopher()
  })
  loader.load('./models/gopher_slimdataEarL.json', (geometry, materials) => {
    gopherEarLMesh = addParts(rootEarL, geometry, materials, 40)
    createGopher()
  })
  loader.load('./models/gopher_slimdataBody.json', (geometry, materials) => {
    geometry.computeFaceNormals()
    geometry.computeVertexNormals()
    gopherBodyMesh = new THREE.Mesh(geometry, materials)
    gopherBodyMesh.scale.set(40, 40, 40)

    createGopher()
  })

  let socket
  let gopherMove = true
  if (golangMode) {
    socket = io('http://localhost:5050')
    socket.on('news', (data) => {
      setupText(data)
      scene.add(gopherBoardMesh)
      texture.needsUpdate = true
      setTimeout(() => {
        scene.remove(gopherBoardMesh)
      }, 15000)
    })
    socket.on('writeHtml', (data) => {
      drawHthml(data, texture)
      scene.add(gopherBoardMesh)
      texture.needsUpdate = true
      setTimeout(() => {
        scene.remove(gopherBoardMesh)
      }, 15000)
    })
    socket.on('stop', (data) => {
      let timeout = 30000
      if (!data) {
        timeout = data
      }
      gopherMove = false
      setTimeout(() => {
        gopherMove = true
      }, timeout)
    })


    console.log(`golangMode = ${golangMode}`)
  }
}

function checkGolangMode(next) {
  const h = window.location.search.slice(1).split('&')
  const golangMode = Boolean(h[0].split('=')[1] === 'true')
  if (golangMode) {
    const s = document.createElement('script')
    s.src = 'http://localhost:5050/socket.io.js'
    s.onload = () => {
      next(golangMode)
    }
    document.body.appendChild(s)
  } else {
    next(false)
  }
}

checkGolangMode(gopheronMain)