import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  // Example: request the app version
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
  // Example: call Node backend health or ask main to do something
  restartApp: () => ipcRenderer.send('restart-app')
});
