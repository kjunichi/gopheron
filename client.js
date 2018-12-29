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
  
  socket.on('gopher recv', (msg) => {
    console.log(`msg : ${msg} : count = ${count}`)
    count--
    if (count <= 0) {
      process.exit(0)
    }
  })
  
  count++
  console.log(`count = ${count}`)
  socket.emit('gopher front', '1000')

  count++
  console.log(`count = ${count}`)
  socket.emit('gopher send', '🙉🌈絵文字はどうかな？abc😭')

  setTimeout(() => {
    count++
    console.log(`count = ${count}`)
    socket.emit('gopher sendHtml', '<h1>🙉🌈</h1><p>HTMLはどうかな？abc😭</p>')
  }, 10 * 1000)
  
  
})