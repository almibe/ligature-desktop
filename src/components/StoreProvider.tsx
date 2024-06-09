import { createContext } from "solid-js";
import { createStore } from "solid-js/store";

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
    }
});

export function StoreProvider(props) {    
    return (
        <StoreContext.Provider>
            {props.children}
        </StoreContext.Provider>
    )
}
