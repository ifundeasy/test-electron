const { app, BrowserWindow, protocol } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
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
    const filePath = path.join(__dirname, url.split('?')[0]);
    callback({ path: path.normalize(filePath) });
  });

  // Register the custom URL scheme for all platforms
  app.setAsDefaultProtocolClient('myapp');

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
  handleOpenUrl(url);
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
        handleOpenUrl(url);
      }
    }
  });
}

function handleOpenUrl(url) {
  const urlObj = new URL(url);
  const accessToken = urlObj.searchParams.get('access_token');
  console.log('Access Token:', accessToken);

  if (mainWindow) {
    mainWindow.loadURL(`myapp://index.html?access_token=${accessToken}`);
  }
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});