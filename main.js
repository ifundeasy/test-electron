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

  // Register the custom URL scheme for macOS
  if (process.platform === 'darwin') {
    app.setAsDefaultProtocolClient('myapp');
  }

  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Handle the protocol URL
app.on('open-url', (event, url) => {
  event.preventDefault();
  console.log('open-url event', url);
  const mainWindow = BrowserWindow.getAllWindows()[0];
  if (mainWindow) {
    mainWindow.loadURL(url);
  }
});

// Register the custom URL scheme for Windows and Linux
if (process.platform === 'win32' || process.platform === 'linux') {
  app.setAsDefaultProtocolClient('myapp');
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Handle second instance for Windows and Linux
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', (event, argv, workingDirectory) => {
    // On Windows, handle the protocol URL
    if (process.platform === 'win32') {
      const url = argv.find(arg => arg.startsWith('myapp://'));
      if (url) {
        const mainWindow = BrowserWindow.getAllWindows()[0];
        if (mainWindow) {
          mainWindow.loadURL(url);
        }
      }
    }
  });
}
