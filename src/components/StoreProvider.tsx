import { createContext, createEffect, useContext } from "solid-js";
import { createStore } from "solid-js/store";
import { runBend } from "../lib/ligature-client";

export type Mode = "Edit" | "Preview" | "View";

export const modeToStatus = {
    "Edit": "Editting",
    "Preview": "Preveiwing",
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
        const res = await runBend('Ligature.query "pages" `' + location + '` `md-content` ? | Array.map Statement.value');
        if (res.startsWith('[')) {
            const value = JSON.parse(res) //TODO eval this using Bend's interpreter
            if (value.length != 0) {
                store.setLocationContent(value[0])
                store.setBodyContent(value[0])
            } else {
                store.setBodyContent("New page.")
                store.setMode("Edit")
            }
        } else {
            store.setBodyContent(res)
        }
    } else {
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
