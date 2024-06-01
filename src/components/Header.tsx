import { History } from './History';
import { initializeRepl } from '@ligature/ligature-components/src/repl/repl.ts';
import '@shoelace-style/shoelace/dist/themes/light.css';
import '@shoelace-style/shoelace/dist/components/input/input.js';
import '@shoelace-style/shoelace/dist/components/button/button.js';
import '@shoelace-style/shoelace/dist/components/button-group/button-group.js';
import '@shoelace-style/shoelace/dist/components/icon/icon.js';
import '@shoelace-style/shoelace/dist/components/icon-button/icon-button.js';
import '@shoelace-style/shoelace/dist/components/dialog/dialog.js';

import reloadIcon from '../icons/arrow-clockwise.svg';
import terminalIcon from '../icons/terminal.svg';
import questionIcon from '../icons/question.svg';
import editIcon from '../icons/journal-code.svg';
import homeIcon from '../icons/house-heart.svg';
import historyIcon from '../icons/clock-history.svg';

import { runBend } from '../lib/ligature-client';
import { Match, Switch, createEffect, useContext } from 'solid-js';
import { StoreContext, loadLocation, modeToStatus } from './StoreProvider';

export function Header() {
  let term;
  const store = useContext(StoreContext);
  setTimeout(() => {
    term = initializeRepl(document.querySelector('#terminal'), async (command) => {
      return await runBend(command, new Map())
    });
  });
  createEffect(() => {
    const location = store.state.location
    const el = document.querySelector("#addressBar")
    el?.setAttribute("value", location)
  })
  return <>
      <div id='header'>
        <div class="status">{modeToStatus[store.state.mode]}: <a href="#" onclick={setAddress}>&lt;{store.state.location}&gt;</a></div>
        <Switch>
          <Match when={store.state.mode == "Edit"}>
            <sl-button-group id="editHeader" label="Alignment">
              <sl-button size="small" onclick={() => save(store)}>Save</sl-button>
              <sl-button size="small" onclick={cancel}>Cancel</sl-button>
              <sl-button size="small" onclick={() => preview()}>Preview</sl-button>
            </sl-button-group>
          </Match>
          <Match when={true}>
            <sl-icon-button src={homeIcon} onclick={home}></sl-icon-button>
            <sl-icon-button src={reloadIcon} onclick={reload}></sl-icon-button>
            <sl-icon-button src={editIcon} onclick={edit}></sl-icon-button>
            <sl-icon-button src={terminalIcon} onclick={terminal}></sl-icon-button>
            <sl-icon-button src={questionIcon} onclick={help}></sl-icon-button>
            <sl-icon-button src={historyIcon} onclick={history}></sl-icon-button>
          </Match>
        </Switch>
      </div>

      <sl-dialog label='Terminal' id='terminal-dialog' style='--width: 95vw;'>
        <div id='terminal'></div>
      </sl-dialog>

      <sl-dialog label='Help' id='help-dialog' style='--width: 50vw;'>
        <p>Help!</p>
      </sl-dialog>

      <sl-dialog label='History' id='history-dialog' style='--width: 50vw;'>
        <History></History>
      </sl-dialog>

      <sl-dialog label='Address' id='address-dialog' style='--width: 90vw;'>
        <sl-input id="addressBar" disabled={store.state.editMode} onkeydown={(e) => addressBarChange(e)} defaultValue="home"></sl-input>
      </sl-dialog>
  </>;

  function addressBarChange(e) {
    if(e.keyCode === 13){
        const location = document.querySelector("#addressBar")?.value
        store.setLocation(location);
        document.querySelector('#address-dialog').hide();
    }
  }

  function preview() {
    store.setBodyContent(store.state.editorContent)
  }

  function cancel() {
    store.setBodyContent(store.state.locationContent)
    store.setMode("View")
  }

  function edit() {
    store.setMode("Edit")
  }

  function reload() {
    loadLocation(store.state.location)
    store.setMode("View")
  }

  function history() {
    document.querySelector('#history-dialog').show();
  }

  function help() {
    document.querySelector('#help-dialog').show();
  }

  function setAddress() {
    document.querySelector('#address-dialog').show();
    setTimeout(() => {
      document.querySelector('#addressBar').focus();
    })
  }

  function terminal() {
    document.querySelector('#terminal-dialog').show();
    setTimeout(() => {
      term.focus();
    }, 200);
  }

  async function home() {
    store.setLocation("home")
    reload()
  }

  async function save() {
    const content = store.state.editorContent
    const location = store.state.location
    const res = await runBend('Ligature.addStatements "pages" [@location `entry` (Bend.writeValue { timestamp = DateTime.ticks (), mdContent = @content } )]',
      new Map([
        ["location", "`" + location + "`"],
        ["content", JSON.stringify(content)]
      ]));
    reload()
    store.setLocationContent(content)
    store.setMode("View")
  }
}
