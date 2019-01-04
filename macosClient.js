const socket = require('socket.io-client')('http://localhost:5050')
const grpc = require('grpc')
const protoLoader = require('@grpc/proto-loader')

let client = null

const initGrpc = (argv) => {
  console.log(`initGrpc argv2 = ${argv}`)
  const PROTO_PATH = __dirname + '/helloworld.proto'

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
  const host = argv[0]
  client = new helloworld.Greeter(`${host}:50051`,
    grpc.credentials.createInsecure())
}

const procGrpc = (socket, argv) => {
  console.log(`argv = ${argv}`)

  client.sayHelloAgain({
    name: "dummy"
  }, (err, response) => {
    if (!err) {
      const html = `${response.message}`
      socket.emit('gopher front', '1000')
      socket.emit('gopher sendHtml', html)
    }
  })
}

socket.on('disconnect', () => {})
socket.on('connect', () => {
  let count = 2
  //console.log('connect!')
  socket.on('gopher recv', (msg) => {
    console.log(`recv: ${msg}`)
    count--
    if (count <= 0) {
      process.exit(0)
    }
  })

  setTimeout(() => {
    if (argv.length > 0) {
      procGrpc(socket, argv.join(' '))
    }
  }, 1)
})

const argv = []
for (const i in process.argv) {
  if (i < 2) {
    continue
  }
  argv.push(process.argv[i])
}
//console.log(argv)
initGrpc(argv)