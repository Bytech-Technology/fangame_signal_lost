import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
  exitGame: () => ipcRenderer.send("exit-game")
});
