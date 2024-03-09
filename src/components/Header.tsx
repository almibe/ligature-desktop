import { initializeRepl } from '@ligature/ligature-components/src/repl/repl.ts';
import '@shoelace-style/shoelace/dist/themes/light.css';
import '@shoelace-style/shoelace/dist/components/input/input.js';
import '@shoelace-style/shoelace/dist/components/button/button.js';
import '@shoelace-style/shoelace/dist/components/icon/icon.js';
import '@shoelace-style/shoelace/dist/components/icon-button/icon-button.js';
import '@shoelace-style/shoelace/dist/components/dialog/dialog.js';

import reloadIcon from '../icons/arrow-clockwise.svg';
import terminalIcon from '../icons/terminal.svg';
import questionIcon from '../icons/question.svg';
import editIcon from '../icons/journal-code.svg';
import homeIcon from '../icons/house-heart.svg';

import { runBend } from '../lib/ligature-client';
import { useContext } from 'solid-js';
import { StoreContext } from './StoreProvider';

let term;

function addressBarChange(e, store) {
  if(e.keyCode === 13){
      const location = document.querySelector("#addressBar")?.textContent
      console.log(location)
      store.setLocation(location);
  }
}

function edit(store) {
  store.toggleEdit()
  const iconElement = document.querySelector("#editIcon");
  if (store.state.editMode) {
    iconElement?.classList.add("selected")
  } else {
    iconElement?.classList.remove("selected")
  }
}

function reload() {
  console.log("reload...")
}

function help() {
  document.querySelector('#help-dialog').show();
}

function terminal() {
  document.querySelector('#terminal-dialog').show();
  setTimeout(() => {
    term.focus();
  }, 200);
}

async function run() {
//  const res = await runBend(props.editorContent)
//  props.setResults(res)
}

async function home() {
//  props.setLocation("home")
}

export function Header() {
  const store = useContext(StoreContext);
  setTimeout(() => {
    term = initializeRepl(document.querySelector('#terminal'), async (command) => {
      return await runBend(command)
    });
  });
  return <>
      <div id='header'>
        <sl-input id="addressBar" onkeydown={(e) => addressBarChange(e, store)}></sl-input>
        <sl-icon-button src={homeIcon} onclick={home}></sl-icon-button>
        <sl-icon-button src={reloadIcon} onclick={reload}></sl-icon-button>
        <sl-icon-button id="editIcon" src={editIcon} onclick={() => edit(store)}></sl-icon-button>
        <sl-icon-button src={terminalIcon} onclick={terminal}></sl-icon-button>
        <sl-icon-button src={questionIcon} onclick={help}></sl-icon-button>
        <span>Location: &lt;{store.state.location}&gt;</span>
      </div>

      <sl-dialog label='Terminal' id='terminal-dialog' style='--width: 95vw;'>
        <div id='terminal'></div>
      </sl-dialog>

      <sl-dialog label='Help' id='help-dialog' style='--width: 95vw;'>
        <p>Help!</p>
      </sl-dialog>
  </>;
}
