import { createGlobalEmitter } from "@solid-primitives/event-bus";
import { Applet } from "./Results.tsx";

export const bus = createGlobalEmitter<{
    RunScript: { script: string }
    AddResult: { text: string }
    RemoveResult: { id: string }
    ClearEditor: {}
    AddApplet: { applet: Applet }
    RemoveApplet: {}
}>();
