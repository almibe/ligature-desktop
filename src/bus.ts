import { createGlobalEmitter } from "@solid-primitives/event-bus";

export const bus = createGlobalEmitter<{
    AddTab: {
        tabName: string,
        panel: Element
    };
    OpenRepl: {};
    RunScript: {
        script: string,
        callback: (result) => null
    };
}>();
