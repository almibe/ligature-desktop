import '@shoelace-style/shoelace/dist/components/button/button'
import '@shoelace-style/shoelace/dist/components/button-group/button-group'
import '@shoelace-style/shoelace/dist/components/split-panel/split-panel'
import '@shoelace-style/shoelace/dist/components/tab-group/tab-group'
import '@shoelace-style/shoelace/dist/components/tab/tab'
import { createSignal, onMount } from 'solid-js'

const [results, setResults] = createSignal("")

function newDocument() {
    const tabs = document.querySelector("#documentTabs")
    for(let child of tabs.children) {
        child.removeAttribute("active")
    }
    const newTab = document.createElement("sl-tab")
    newTab.setAttribute("slot", "nav")
    newTab.textContent = "New.wander"
    newTab.setAttribute("closable", "")
    newTab.setAttribute("active", "")
    newTab.addEventListener("sl-close", () => {
        tabs.removeChild(newTab)
    })
    tabs.appendChild(newTab)
}

function runScript() {
    const script = document.querySelector("#editor").value
    setResults(script)
}

onMount(async () => {
    setTimeout(() => {
        const tabs = document.querySelector("#documentTabs")
        for(let child of tabs.children) {
            child.addEventListener("sl-close", () => { 
                tabs.removeChild(child)
            })
        }
    })
});

export const Editor = () => {
    return <div style="height:100%; width: 100%">
        <sl-split-panel vertical style="height:100%">
            <div
                slot="start"
                style="background: var(--sl-color-neutral-50); display: flex; align-items: center; justify-content: center; overflow: hidden;">
                    <div style="height:100%; width: 100%">
                        <sl-button-group label="Alignment">
                            <sl-button size="small" onclick={runScript}><img src="/src/assets/icons/play.svg" alt="Run"></img></sl-button>
                            <sl-button size="small" onclick={newDocument}>New</sl-button>
                            <sl-button size="small">Open</sl-button>
                        </sl-button-group>
                        <sl-tab-group id="documentTabs">
                            <sl-tab slot="nav" active closable>New.wander</sl-tab>
                        </sl-tab-group>
                        <textarea style="height:100%; width: 100%" id="editor"></textarea>
                    </div>
            </div>
            <div
                slot="end"
                style="background: var(--sl-color-neutral-50); display: flex; align-items: center; justify-content: center; overflow: hidden;">
                    <div>{results()}</div>
            </div>
        </sl-split-panel>
    </div>
}
