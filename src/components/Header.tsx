import { initializeRepl } from '@ligature/ligature-components/src/repl/repl.ts';
import '@shoelace-style/shoelace/dist/themes/light.css';
import '@shoelace-style/shoelace/dist/components/button/button.js';
import '@shoelace-style/shoelace/dist/components/icon/icon.js';
import '@shoelace-style/shoelace/dist/components/icon-button/icon-button.js';
import '@shoelace-style/shoelace/dist/components/dialog/dialog.js';

import terminalIcon from "../icons/terminal.svg";
import playIcon from "../icons/play.svg";
import questionIcon from "../icons/question.svg";

import { runBend } from '../lib/ligature-client';

let term;
let props;

function help() {
  document.querySelector("#help-dialog").show();
}

function terminal() {
  document.querySelector("#terminal-dialog").show();
  setTimeout(() => {
    term.focus();
  }, 200);
}

async function run() {
  const res = await runBend(props.editorContent)
  props.setResults(res)
}

export function Header(properties) {
  props = properties
  setTimeout(() => {
    term = initializeRepl(document.querySelector("#terminal"), async (command) => {
      return await runBend(command)
    })
  })
  return <>
      <div id="header">
        <sl-icon-button src={playIcon} onclick={run}></sl-icon-button>
        <sl-icon-button src={terminalIcon} onclick={terminal}></sl-icon-button>
        <sl-icon-button src={questionIcon} onclick={help}></sl-icon-button>
      </div>

      <sl-dialog label="Terminal" id="terminal-dialog" style="--width: 95vw;">
        <div id="terminal"></div>
      </sl-dialog>

      <sl-dialog label="Help" id="help-dialog" style="--width: 95vw;">
        <p>Help!</p>
      </sl-dialog>
  </>;
}
