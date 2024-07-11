import { initializeEditor } from "@ligature/ligature-components/src/editor/LigatureEditor"
import { createSignal, Show, Switch, useContext } from "solid-js";
import { StoreContext } from "./StoreProvider";
import '@shoelace-style/shoelace/dist/components/input/input.js';
import '@shoelace-style/shoelace/dist/components/textarea/textarea.js';
import '@shoelace-style/shoelace/dist/components/select/select.js';
import '@shoelace-style/shoelace/dist/components/option/option.js';
import '@shoelace-style/shoelace/dist/components/dropdown/dropdown.js';
import '@shoelace-style/shoelace/dist/components/button/button.js';
import '@shoelace-style/shoelace/dist/components/menu/menu.js';
import '@shoelace-style/shoelace/dist/components/menu-item/menu-item.js';

export function AddTriples() {

    const [getValueType, setValueType] = createSignal("identifier")

    setTimeout(() => {
        document.querySelector("#valueType").addEventListener("sl-change", (e) => {
            setValueType(e.target.value)
        })
    })

    return <>
        <div id="addTriples">
            <sl-input label="Entity"></sl-input>        
            <sl-input label="Attribute"></sl-input>

            <sl-select id="valueType" value="identifier" label="Value Type">
                <sl-option value="identifier">Identifier</sl-option>
                <sl-option value="string">String</sl-option>
                <sl-option value="int">Int</sl-option>
            </sl-select>

            <Switch>
                <Match when={getValueType() !== "string"}>
                    <sl-input label="Value"></sl-input>
                </Match>
                <Match when={getValueType() === "string"}>
                    <sl-textarea label="Value"></sl-textarea>    
                </Match>
            </Switch>

            <sl-button>Save</sl-button>
        </div>
    </>;
}