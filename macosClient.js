const socket = require('socket.io-client')('http://localhost:5050')


socket.on('test', (msg) => {
  console.log(`form server ! ${msg}`)
})

socket.on('event', (data) => {
  console.log(`event recv! ${data}`)
})
socket.on('disconnect', function () { })
socket.on('chat message', (msg) => {
  console.log(`onChat msg = ${msg}`)
})

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
  const PROTO_PATH = __dirname + '/helloworld.proto'
  const grpc = require('grpc')
  const hello_proto = grpc.load(PROTO_PATH).helloworld
  const host = argv.split(' ')[0]
  const client = new hello_proto.Greeter(`${host}:50051`,
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
  socket.emit('gopher front', '1000')
  count++
  const argv = []
  for (const i in process.argv) {
    if (i < 2) {
      continue
    }
    argv.push(process.argv[i])
  }
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