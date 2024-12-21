import { onMount } from "solid-js"
import { showEditor } from "@ligature/ligature-components/src/editor/editor"
import { EditorView } from "codemirror";
import { run as runScript, Element, Literal, Variable, Quote, Triple, Result, Error, Network, NoResult } from "@ligature/ligature"
import { TabulatorFull as Tabulator } from 'tabulator-tables'
import  "tabulator-tables/dist/css/tabulator.min.css"

import Split from 'split-grid'

function networkToTableData(network: Triple[]): any[] {
    let roles = new Set<string>()
    let results: any[] = []
    network.forEach(([e,a,v]) => {
        let res = results.find((i:any) => i.element == e.value)
        if (res == undefined) {
            const newEntry = {element: e.value}
            newEntry[a.value] = [v.value]
            results.push(newEntry)
            roles.add(a.value)
        } else {
            if (res[a.value] != undefined) {
                res[a.value].push(v.value)
            } else {
                res[a.value] = [v.value]
            }
        }
    })
    return results
}

function printNetwork(n: Array<Triple>): string {
    let res = "{\n"
    for (let [e,a,v] of n) {
        res = res + "  " + printValue(e) + " " + printValue(a) + " " + printValue(v) + ",\n"
    }
    return res + "}"
}

function printValue(value: Element | Literal | Variable | Quote | Network): string {
    if (value.type == 'element') {
        return value.value
    } else if (value.type == 'literal') {
        return value.value
    } else if (value.type == 'network') {
        return printNetwork(value.value)
    } else if (value.type == 'quote') {
        throw "TODO"
    } else if (value.type == 'variable') {
        return value.value
    } else {
        throw "should never reach"
    }
}

function printArgs(args: Array<Element | Literal | Variable | Quote | Network>) {
    let res = ""
    for (let arg of args) {
        if (arg.type == "element") {
            res = res + arg.value + ", "
        } else if (arg.type == "network") {
            res = res + printNetwork(arg.value)
        } else {
            res = res + "???"
        }
    }
    return res
}

function createUiCommands(el: HTMLElement) {
    return [
        {
            name: "print",
            doc: "Print a value",
            action: (args) => {
                let div = document.createElement("div")
                let code = document.createElement("code")
                let pre = document.createElement("pre")
                code.textContent = printArgs(args)
                pre.appendChild(code)
                div.appendChild(pre)
                el.appendChild(div)
            }
        },
        {
            name: "table",
            doc: "Print a table",
            action: (args) => {
                if (args.length == 1) {
                    if (args[0].type == 'network') {
                        let network: Array<Triple> = args[0].value
                        let div = document.createElement("div")
                        div.classList.add("table")
                        let innerDiv = document.createElement("div")
                        div.appendChild(innerDiv)
                        let t = new Tabulator(innerDiv, {
                            data: networkToTableData(network),
                            autoColumns: true            
                        })
                        el.appendChild(div)        
                    } else {
                        throw "invalid call to table"
                    }
                } else {
                    throw "invalid call to table"
                }
            }
        },
        {
            name: "graph",
            doc: "Print a graph",
            action: (args) => {
                console.log("TODO")
            }
        },
    ]
}

export function Application() {
    let editor: EditorView = null;
    onMount(() => {
        Split({
            rowGutters: [{
                track: 1,
                element: document.querySelector('.gutter-row-1'),
            }]
        })
        editor = showEditor(document.querySelector("#editor"), "")
    })

    async function run() {
        document.querySelector("#results").textContent = "";
        runScript(editor.state.doc.toString(), createUiCommands(document.querySelector("#results")))
    }
    
    return <div style="height:100%; width: 100%">
        <div class="grid" style="height:100%; width: 100%">
            <div id="top" style="overflow: auto">
                <div>
                    <button onclick={run}><img src="../../static/icons/play.svg" alt="Add" /></button>
                </div>
                <div id="editor"></div>
            </div>
            <div class="gutter-row gutter-row-1"></div>
            <div id="results" style="overflow: auto">
            </div>
        </div>
    </div>
}
