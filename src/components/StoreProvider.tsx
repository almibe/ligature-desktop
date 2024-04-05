import { createContext, createEffect, useContext } from "solid-js";
import { createStore } from "solid-js/store";
import { runBend } from "../lib/ligature-client";

export type Mode = "Edit" | "View";

export const modeToStatus = {
    "Edit": "Editting",
    "View": "Location",
}

const [state, setState] = createStore({
    location: "home",
    locationContent: "",
    bodyContent: "",
    editorContent: "",
    mode: "View"
})
export const StoreContext = createContext({
    state,
    setMode: (mode: Mode) => {
        setState({mode})
    },
    setLocation: (location: string) => {
        setState({location})
    },
    setLocationContent: (locationContent: string) => {
        setState({locationContent})
    },
    setBodyContent: (bodyContent: string) => {
        setState({bodyContent})
    },
    setEditorContent: (editorContent: string) => {
        setState({editorContent})
    }
});

export async function loadLocation(location: string) {
    const store = useContext(StoreContext);
    if (location.match(/^[a-zA-Z-_0-9]+$/)) {
        const res = await runBend(
            'res = Ligature.match "pages" @location `entry` ?'
            + '| Array.map Statement.value | Array.map Bend.readValue '
            + '| Array.fold (\\left right -> when (Int.lt left.timestamp right.timestamp => right, true => left)) {timestamp = 0, mdContent = ""}, res.mdContent',
            new Map([["location", "`" + location + "`"]])
        );
        const value = JSON.parse(res) //TODO eval this using Bend's interpreter
        store.setLocationContent(value)
        store.setBodyContent(value)
    } else {
        store.setLocationContent("Invalid request.")
        store.setBodyContent("Invalid request.")
    }
}

createEffect(() => loadLocation(state.location))

export function StoreProvider(props) {    
    return (
        <StoreContext.Provider>
            {props.children}
        </StoreContext.Provider>
    )
}
