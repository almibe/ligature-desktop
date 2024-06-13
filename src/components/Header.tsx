import '@shoelace-style/shoelace/dist/themes/light.css';
import '@shoelace-style/shoelace/dist/components/input/input.js';
import '@shoelace-style/shoelace/dist/components/button/button.js';
import '@shoelace-style/shoelace/dist/components/button-group/button-group.js';
import '@shoelace-style/shoelace/dist/components/icon/icon.js';
import '@shoelace-style/shoelace/dist/components/icon-button/icon-button.js';
import '@shoelace-style/shoelace/dist/components/dialog/dialog.js';
import { LigatureValue } from "@ligature/ligature-components";
import {LitElement, css, html} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import { State, run } from "./StoreProvider";

import playIcon from '../icons/play.svg';
import questionIcon from '../icons/question.svg';

@customElement('header-bar')
export class HeaderBar extends LitElement {
  static styles = css`
  `;

  private state: State | null = null

  private async runAction() {
    run(this.state)
  }

  private helpAction() {
    document.querySelector('#help-dialog').show();
  }

  // Render the UI as a function of component state
  render() {
    return html`<div id='header'>
            <sl-icon-button src={playIcon} onclick={runAction}></sl-icon-button>
            <sl-icon-button src={questionIcon} onclick={helpAction}></sl-icon-button>
      </div>

      <sl-dialog label='Help' id='help-dialog' style='--width: 50vw;'>
        <p>Help!</p>
      </sl-dialog>

      <sl-dialog label='Address' id='address-dialog' style='--width: 90vw;'>
        <sl-input id="addressBar" disabled={store.state.editMode} onkeydown={(e) => addressBarChange(e)} defaultValue="home"></sl-input>
      </sl-dialog>`;
  }
}
