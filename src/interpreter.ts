import { bus } from './bus.ts';
import { invoke } from '@tauri-apps/api/tauri';
import { newEnvironment } from '@wander-lang/wander/src/environment.ts';
import { run } from '@wander-lang/wander/src/interpreter.ts';

bus.on("RunScript", ({ script }) => {
        invoke("run", {script}).then((resultText: string) => {
                let result = run(resultText, newEnvironment())
                bus.emit("AddResult", result)
//        bus.emit("AddResult", { text: newResult });
        })
})
