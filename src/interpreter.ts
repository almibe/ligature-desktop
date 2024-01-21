import { bus } from './bus.ts';
import { invoke } from '@tauri-apps/api/tauri';
import { newEnvironment } from '@wander-lang/wander/src/environment.ts';
import { printValue, run } from '@wander-lang/wander/src/interpreter.ts';
import { ModuleValue } from '@wander-lang/wander/src/values.ts';

bus.on("RunScript", ({ script }) => {
        const m: ModuleValue = {type: "Module", value: new Map([["action", {type: "String", value: "run" }], ["script", {type: "String", value: script}]])}
        invoke("run", {script: printValue(m)}).then((resultText: string) => {
                let result = run(resultText, newEnvironment())
                bus.emit("AddResult", { script, result })
//        bus.emit("AddResult", { text: newResult });
        })
})
