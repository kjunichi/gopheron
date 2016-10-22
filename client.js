const socket = require('socket.io-client')('http://localhost:5050')

socket.on('test', (msg) => {
        console.log("form server !")
})

socket.on('event', (data) => {
        console.log(`event recv! ${data}`)
});
socket.on('disconnect', function () { });
socket.on('chat message', (msg) => {
        console.log(`onChat msg = ${msg}`)
})

//socket.emit("chat message","hogefuga")
const someData = "abrakatabura"
socket.on('connect', () => {
        console.log("connect!")
        //socket.emit('chat message', JSON.stringify(someData))
        //socket.emit("test", "this is testmsg.")
        socket.emit('gopher send', "そうとくんなおくんげんきかな？")
        socket.on('gopher recv', (msg) => {
                process.exit(0)
        })
        //setTimeout(process.exit(0),1000);
})