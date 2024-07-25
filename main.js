const { app, BrowserWindow, protocol } = require('electron');
const path = require('path');

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  mainWindow.loadURL('myapp://index.html');
}

app.whenReady().then(() => {
  protocol.registerFileProtocol('myapp', (request, callback) => {
    const url = request.url.substr(7); // strip off "myapp://"
    callback({ path: path.normalize(`${__dirname}/${url}`) });
  });

  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
