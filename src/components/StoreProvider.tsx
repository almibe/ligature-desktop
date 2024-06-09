import { createContext } from "solid-js";
import { createStore } from "solid-js/store";
import { runBend } from "../lib/ligature-client";

const [state, setState] = createStore({
    editorContent: "",
    resultContent: "",
})
export const StoreContext = createContext({
    state,
    setBodyContent: (resultContent: string) => {
        setState({resultContent})
    },
    setEditorContent: (editorContent: string) => {
        setState({editorContent})
    },
    run: async () => {
        let resultContent = await runBend(state.editorContent)
        setState({resultContent})
    }
});

export function StoreProvider(props) {    
    return (
        <StoreContext.Provider>
            {props.children}
        </StoreContext.Provider>
    )
}
