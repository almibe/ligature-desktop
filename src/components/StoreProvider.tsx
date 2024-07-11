import { createContext } from "solid-js";
import { createStore } from "solid-js/store";
import { runWander } from "../lib/ligature-client";
import JSON5 from 'json5'

const [state, setState] = createStore({
    networks: [],
    editorContent: "",
    resultContent: "{}",
    selected: "text",
})
export const StoreContext = createContext({
    state,
    setBodyContent: (resultContent: string) => {
        setState({resultContent})
    },
    setEditorContent: (editorContent: string) => {
        setState({editorContent})
    },
    setSelected: (selected: string) => {
        setState({selected})
    },
    run: async () => {
        let resultContent = await runWander(state.editorContent)
        setState({resultContent})
    },
    readNetworks: async () => {
        const res = await runWander("networks ()")
        const networks: string[] = JSON5.parse(res)
        setState({networks})
    },
    addNetwork: async (networkName: string) => {
        const networks = [networkName]
        setState({networks})
    },
    removeNetwork: async (networkName: string) => {
        
    }
});

export function StoreProvider(props) {
    StoreContext.defaultValue.readNetworks()

    return (
        <StoreContext.Provider>
            {props.children}
        </StoreContext.Provider>
    )
}
