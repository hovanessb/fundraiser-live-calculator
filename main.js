// Modules to control application life and create native browser window
const { app, BrowserWindow } = require('electron')
const path = require('path')
const http = require("http");
const express = require("express");
const { Server } = require("socket.io");

const hostname = "localhost";
const port = 5500;
process.env.SOCKET_PORT = 18092
/*
    socket.io doesn't work with app express middleware
    WORKS with node http server
    
app.listen(port, hostname, () => {
	console.log(`Server running at http://${hostname}:${port}/`);
});
*/

// This needs to be on for a windows build... linux works without this
//  app.commandLine.appendSwitch('no-sandbox');
//  app.commandLine.appendSwitch('disable-gpu');
//  app.commandLine.appendSwitch('disable-software-rasterizer');
//  app.commandLine.appendSwitch('disable-gpu-compositing');
//  app.commandLine.appendSwitch('disable-gpu-rasterization');
//  app.commandLine.appendSwitch('disable-gpu-sandbox');
//  app.commandLine.appendSwitch('--no-sandbox');
//  app.disableHardwareAcceleration();

function createWindow (width, height) {
  // Create the browser window.
  return new BrowserWindow({
    width: width,
    height: height,
    autoHideMenuBar: true,
    useContentSize: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

}

function createSocketIo(){
  const app = express();
  const server = http.createServer(app);
  const io = new Server(server);
  // for favicon
  app.get("/favicon.ico", (req, res) => {
    res.sendStatus(204);
  });

  // for serving static file, by-default user don't have access
  app.use(express.static(path.join(__dirname, "/public")));

  app.get("/", (req, res) => {
    res.status(200).sendFile(path.join(__dirname, "/index.html"));
  });

  app.get("/input", (req, res) => {
    res.status(200).sendFile(path.join(__dirname, "/input.html"));
  });
  io.on("connection", (socket) => {
    console.log("a user connected");
    socket.on("disconnect", () => {
      console.log("user disconnected");
    });
  });

  io.on("connection", (socket) => {
    socket.on("chat message", (msg) => {
      console.log("message: " + msg);
    });
  });

  io.on("connection", (socket) => {
    socket.on("chat message", (msg) => {
      io.emit("chat message", msg);
    });
  });

  server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
  });
  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
}
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  mainWindow = createWindow(1280,720)
  createSocketIo()
  // and load the index.html of the app.
  mainWindow.loadURL(`http://${hostname}:${port}/`)
  mainWindow.focus();

  secondWindow = createWindow(400,100)
  secondWindow.loadURL(`http://${hostname}:${port}/input`)

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
