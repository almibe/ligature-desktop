import '@shoelace-style/shoelace/dist/themes/light.css';
import '@shoelace-style/shoelace/dist/components/input/input.js';
import '@shoelace-style/shoelace/dist/components/button/button.js';
import '@shoelace-style/shoelace/dist/components/button-group/button-group.js';
import '@shoelace-style/shoelace/dist/components/icon/icon.js';
import '@shoelace-style/shoelace/dist/components/icon-button/icon-button.js';
import '@shoelace-style/shoelace/dist/components/dialog/dialog.js';

import playIcon from '../icons/play.svg';
import questionIcon from '../icons/question.svg';

import { runBend } from '../lib/ligature-client';
import { useContext } from 'solid-js';
import { StoreContext } from './StoreProvider';

export function Header() {
  const store = useContext(StoreContext);
  return <>
      <div id='header'>
            <sl-icon-button src={playIcon} onclick={run}></sl-icon-button>
            <sl-icon-button src={questionIcon} onclick={help}></sl-icon-button>
      </div>

      <sl-dialog label='Help' id='help-dialog' style='--width: 50vw;'>
        <p>Help!</p>
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

  function run() {
    console.log("run")
  }

  function help() {
    document.querySelector('#help-dialog').show();
  }
}
