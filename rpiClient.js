const socket = require('socket.io-client')('http://localhost:5050')
const grpc = require('grpc')
const protoLoader = require('@grpc/proto-loader')

const PROTO_PATH = __dirname + '/helloworld.proto'
const icon = 'data:image/jpeg;base64,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'

let client = null

const initGrpc = () => {
  const packageDefinition = protoLoader.loadSync(
    PROTO_PATH, {
      keepCase: true,
      longs: String,
      enums: String,
      defaults: true,
      oneofs: true
    })
  const protoDescriptor = grpc.loadPackageDefinition(packageDefinition)
  const helloworld = protoDescriptor.helloworld
  client = new helloworld.Greeter('raspberrypi.local:50051', grpc.credentials.createInsecure())
}

const getEmoji = (text) => {
  if (text.indexOf('temp') >= 0) {
    return '🌡'
  }
  if (text.indexOf('frequency') >= 0) {
    return '〰️'
  }
  if (text.indexOf('volt') >= 0) {
    return '⚡️'
  }
  if (text.trim().endsWith('M')) {
    return '🗄'
  }
  return ''
}

const procGrpc = (socket, argv) => {
  console.log(`argv = ${argv}`)
  client.sayHelloAgain({
    name: argv
  }, (err, response) => {
    //console.log('Greeting:', response.message)
    const tmp = response.message
    const msg = `${tmp}<span style="font-size:larger;font-family: 'Segoe UI Emoji';">${getEmoji(tmp)}</span>`
    const html = `<div style="display: flex;flex-wrap:no-wrap;"><div style="width: 132px;padding-right: 2px"><img src="${icon}"></div><div style="font-size: 27px;wrap">${msg}</div></div>`

    socket.emit('gopher sendHtml', html)
  })
}

initGrpc()

socket.on('connect', () => {
  let count = 2

  socket.on('gopher recv', (msg) => {
    console.log(`recv: ${msg} : count = ${count}`)
    count--
    if (count <= 0) {
      process.exit(0)
    }
  })
  setTimeout(() => {
    //console.log('connect!')
    const argv = []
    for (const i in process.argv) {
      if (i < 2) {
        continue
      }
      argv.push(process.argv[i])
    }
    console.log(`argv = ${argv  }, p.argv = ${process.argv}`)
    socket.emit('gopher front', '1000')
    procGrpc(socket, argv.join(' '))
  }, 300)
})