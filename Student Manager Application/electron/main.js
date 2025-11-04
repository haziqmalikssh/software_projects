import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { spawn } from 'child_process';
import isDev from 'electron-is-dev';

let mainWindow;
let serverProcess;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1100,
    height: 770,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  if (isDev) {
    // In dev, load the Vite/CRA dev server
    mainWindow.loadURL('http://localhost:5173');
    // Optionally open devtools:
    // mainWindow.webContents.openDevTools();
  } else {
    // In production, load the built index.html
    mainWindow.loadFile(path.join(process.cwd(), 'client', 'dist', 'index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

function startServer() {
  // Spawn your Node server (server/src/app.js or a start script)
  // Adjust the path and command for your server and environment
  const serverPath = path.join(process.cwd(), 'server');
  if (isDev) {
    // In dev we assume you run the server manually via npm run dev:server
    console.log('Dev mode: please run the Node server separately (npm run dev:server)');
    return;
  }

  // Production: spawn the node server bundled in app
  serverProcess = spawn(process.execPath, ['server/dist/index.js'], {
    cwd: process.cwd(),
    stdio: 'inherit'
  });

  serverProcess.on('error', (err) => console.error('Server process error:', err));
  serverProcess.on('exit', (code) => console.log(`Server exited with code ${code}`));
}

app.whenReady().then(() => {
  if (!isDev) startServer();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (serverProcess) serverProcess.kill();
  if (process.platform !== 'darwin') {
    app.quit();
  }
  ipcMain.handle('get-app-version', () => app.getVersion());
  ipcMain.on('restart-app', () => {
  app.relaunch();
  app.exit();
});
