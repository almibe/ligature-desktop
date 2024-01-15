import { bus } from './bus.ts';
import { invoke } from '@tauri-apps/api/tauri'

bus.on("RunScript", ({ script }) => {
//        let newResult = printResult(run(script, newEnvironment()))
//        bus.emit("AddResult", { text: newResult });
        invoke("run", {script}).then((result: string) => bus.emit("AddResult", { text: result }))
})
