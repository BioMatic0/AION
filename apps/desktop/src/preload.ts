import { contextBridge } from "electron";

contextBridge.exposeInMainWorld("aionDesktop", {
  platform: "windows-shell"
});
