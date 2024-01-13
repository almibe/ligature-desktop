import { createGlobalEmitter } from "@solid-primitives/event-bus";

export const bus = createGlobalEmitter<{
    AddTab: {
        tabName: string,
        panel: Element
    };
    OpenRepl: {};
    //Tell the IDE to Run.
    //This usually means get the script from the 
    //Run: {};
}>();
