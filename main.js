"use strict";

const electron = require('electron');
const {app} = electron; // Module to control application life.
const {BrowserWindow} = electron;
const {ipcMain} = electron;


// Report crashes to our server.
//require('crash-reporter').start();

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
var mainWindow = null;

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform != 'darwin') {
    app.quit();
  }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', function() {
  const electronScreen = electron.screen;
  const size = electronScreen.getPrimaryDisplay().workAreaSize;
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: size.width,
    height: size.height,
    transparent: true,
    frame: false,
    "always-on-top": true,
    "title-bar-style": "hidden-inset"
  });

  // and load the index.html of the app.
  mainWindow.loadURL('file://' + __dirname + '/index.html');
  mainWindow.setIgnoreMouseEvents(true);
  mainWindow.webContents.on('did-finish-load', function() {
    let accx = 1;
    const idleFunc = function() {
      const size = electronScreen.getPrimaryDisplay().workAreaSize;

      const pos = mainWindow.getPosition();
      if (pos[0] + 8 > size.width - mainWindow.getSize()[0]) {
        accx = -1;
        mainWindow.webContents.send('reverse', 'whoooooooh!');
      }
      if (pos[0] < 10) {
        accx = 1;
        mainWindow.webContents.send('forward', 'whoooooooh!');
      }
      mainWindow.setPosition(pos[0] + 8 * accx, pos[1]);
      setTimeout(idleFunc, 100);
    };
    //idleFunc();

  });
  // Open the DevTools.
  //mainWindow.openDevTools();

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
});
