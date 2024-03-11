import { createContext } from "solid-js";
import { createStore } from "solid-js/store";

export type Mode = "Edit" | "Preview" | "View";

export const modeToStatus = {
    "Edit": "Editting",
    "Preview": "Preveiwing",
    "View": "Location",
}

const [state, setState] = createStore({
    location: "home",
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
    setBodyContent: (bodyContent: string) => {
        setState({bodyContent})
    },
    setEditorContent: (editorContent: string) => {
        setState({editorContent})
    }
});

export function StoreProvider(props) {    
    return (
        <StoreContext.Provider>
            {props.children}
        </StoreContext.Provider>
    )
}
