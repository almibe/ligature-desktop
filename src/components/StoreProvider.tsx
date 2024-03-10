import { createContext } from "solid-js";
import { createStore } from "solid-js/store";

const [state, setState] = createStore({
    location: "home",
    bodyContent: "",
    editorContent: "",
    editMode: false
})
export const StoreContext = createContext({
    state,
    toggleEdit: () => {
        setState({editMode: !state.editMode})
    },
    setLocation: (location: string) => {
        setState({location: location})
    },
    setBodyContent: (content: string) => {
        setState({bodyContent: content})
    }
});

export function StoreProvider(props) {    
    return (
        <StoreContext.Provider>
            {props.children}
        </StoreContext.Provider>
    )
}
