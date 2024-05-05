import { createContext, createEffect, useContext } from "solid-js";
import { createStore } from "solid-js/store";
import { runBend } from "../lib/ligature-client";

const [state, setState] = createStore({
})
export const StoreContext = createContext({
    state,
});

export function StoreProvider(props) {    
    return (
        <StoreContext.Provider>
            {props.children}
        </StoreContext.Provider>
    )
}
