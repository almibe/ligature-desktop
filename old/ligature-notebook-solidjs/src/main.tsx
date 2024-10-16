import "@shoelace-style/shoelace/dist/themes/light.css"
import '@shoelace-style/shoelace/dist/components/split-panel/split-panel'
import { render } from "solid-js/web";
import { Editor } from "./Editor.tsx";
import { appDataDir } from '@tauri-apps/api/path';
import { readDir } from "@tauri-apps/plugin-fs";

const appDataDirPath = await appDataDir();
console.log("appDataDirPath", appDataDirPath)
console.log("read - ", readDir(appDataDirPath))

const App = () => { return <Editor></Editor> };

render(App, document.querySelector("#main"));
