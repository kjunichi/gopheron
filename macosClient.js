const socket = require('socket.io-client')('http://localhost:5050')
const grpc = require('grpc')
const protoLoader = require('@grpc/proto-loader')

socket.on('disconnect', function () { })

const procGrpc = (socket, argv) => {
  console.log(`argv = ${argv}`)
  const PROTO_PATH = __dirname + '/helloworld.proto'

  const packageDefinition = protoLoader.loadSync(
    PROTO_PATH,
    {
      keepCase: true,
      longs: String,
      enums: String,
      defaults: true,
      oneofs: true
    })
  const protoDescriptor = grpc.loadPackageDefinition(packageDefinition)
  const helloworld = protoDescriptor.helloworld
  const host = argv.split(' ')[0]
  const client = new helloworld.Greeter(`${host}:50051`,
    grpc.credentials.createInsecure())
  client.sayHelloAgain({
    name: "dummy"
  }, (err, response) => {
    if (!err) {
      const tmp = response.message
      const html = `${tmp}`
      socket.emit('gopher sendHtml', html)
    }
  })
}

socket.on('connect', () => {
  //console.log('connect!')
  let count = 0
  const argv = []
  for (const i in process.argv) {
    if (i < 2) {
      continue
    }
    argv.push(process.argv[i])
  }
  socket.emit('gopher front', '1000')
  count++

  if (argv.length > 0) {
    procGrpc(socket, argv.join(' '))
    count++
  }

  socket.on('gopher recv', (msg) => {
    console.log(`recv: ${msg}`)
    count--
    if (count <= 0) {
      process.exit(0)
    }
  })
})