"use strict";

const electron = require('electron');
const {app} = electron; // Module to control application life.
const {BrowserWindow} = electron;
const {ipcMain} = electron;
const socket = require('socket.io-client')('http://localhost:5050/gopheron');
// Report crashes to our server.
//require('crash-reporter').start();

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow = null;

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform != 'darwin') {
    app.quit();
  }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', () => {
  socket.emit("electron start", "status OK");
  const electronScreen = electron.screen;
  const size = electronScreen.getPrimaryDisplay().workAreaSize;
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: size.width,
    height: size.height,
    transparent: true,
    frame: false,
    "always-on-top": true,
    show: false,
    "title-bar-style": "hidden-inset"
  });
  mainWindow.on('ready-to-show',()=>{
    mainWindow.show();
    mainWindow.focus();
  });
  // and load the index.html of the app.
  mainWindow.loadURL(`file://${__dirname}/index.html`);
  mainWindow.setIgnoreMouseEvents(true);

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
});
