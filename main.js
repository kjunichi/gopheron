'use strict'

const electron = require('electron')
const { app, BrowserWindow, ipcMain, nativeImage } = electron // Module to control application life.
let socket
// Report crashes to our server.
// require('crash-reporter').start()

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow = null
let golangMode = false

if (JSON.stringify(process.argv).indexOf('--with-golang') > 0) {
  // golang mode.
  socket = require('socket.io-client')('http://localhost:5050/gopheron')
  golangMode = true
  socket.on('front', (data) => {
    console.log(`bringToFront: ${data}`) // prints "ping"
    mainWindow.setAlwaysOnTop(true)
    setTimeout(() => {
      mainWindow.setAlwaysOnTop(false)
    }, data)
  })
}

if (process.platform.indexOf('linux') >= 0) {
  app.commandLine.appendSwitch('--enable-transparent-visuals')
  app.commandLine.appendSwitch('--disable-gpu')
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform != 'darwin') {
    app.quit()
  }
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', () => {
  if (golangMode) {
    socket.emit('electron start', 'status OK')
  }

  app.setName("gopheron")
  // macOS only
  const iconimage = nativeImage.createFromPath(`${__dirname}/gopheron_icon.png`)
  app.dock.setIcon(iconimage)

  const electronScreen = electron.screen
  const size = electronScreen.getPrimaryDisplay().workAreaSize
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: size.width,
    height: size.height,
    transparent: true,
    frame: false,
    //'always-on-top': true,
    show: false,
    'title-bar-style': 'hidden-inset'
  })
  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
    mainWindow.focus()
  })
  // and load the index.html of the app.
  mainWindow.loadURL(`file://${__dirname}/index.html?golang=${golangMode}`)
  if (!process.env.DEBUG) {
    mainWindow.setIgnoreMouseEvents(true)
  }

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })

  ipcMain.on('bringToFront', (event, arg) => {
    console.log(`bringToFront: ${arg}`) // prints "ping"
    mainWindow.setAlwaysOnTop(true)
    setTimeout(() => {
      mainWindow.setAlwaysOnTop(false)
    }, arg)
  })
})