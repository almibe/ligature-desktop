import { createGlobalEmitter } from "@solid-primitives/event-bus";
import { Applet } from "./Results.tsx";

export const bus = createGlobalEmitter<{/*@once*/
    RunScript: { script: string }
    SetEditor: { script: string }
    AddResult: { script: string, result: WanderResult }
    RemoveResult: { id: string }
    ClearEditor: {}
    AddApplet: { applet: Applet }
    RemoveApplet: {}
}>();
