import { createGlobalEmitter } from "@solid-primitives/event-bus";

export const bus = createGlobalEmitter<{
    RunScript: { script: string }
    AddResult: { text: string }
    RemoveResult: { id: string }
}>();
