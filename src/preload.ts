const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
    signChallenge: (data: any) => ipcRenderer.invoke('sign-challenge', data),
    createPubKey: () => ipcRenderer.invoke('create-public-key', null)
});