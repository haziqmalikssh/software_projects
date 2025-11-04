const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  // Check environment
  const isDev = !app.isPackaged;

  if (isDev) {
    // Change this port if Vite uses a different one!
    const VITE_PORT = process.env.VITE_PORT || 5173;
    win.loadURL(`http://localhost:${VITE_PORT}`);
    win.webContents.openDevTools();
  } else {
    win.loadFile(path.join(__dirname, 'dist', 'index.html'));
  }
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
