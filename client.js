const socket = require('socket.io-client')('http://localhost:5050')

socket.on('test', (msg) => {
  console.log('form server !')
})

socket.on('event', (data) => {console.log(`event recv! ${data}`)})
socket.on('disconnect', function() {})
socket.on('chat message', (msg) => {
  console.log(`onChat msg = ${msg}`)
})

socket.on('connect', () => {
  console.log('connect!')
  let count = 0
  socket.emit('gopher front', '1000')
  count++

  socket.emit('gopher send', '🙉🌈絵文字はどうかな？abc😭')
  count++

  setTimeout(() => {
    socket.emit('gopher sendHtml', '<h1>🙉🌈</h1><p>HTMLはどうかな？abc😭</p>')
  }, 10 * 1000)
  count++
  socket.on('gopher recv', (msg) => {
    count--
    if (count <= 0) {
      process.exit(0)
    }
  })
})