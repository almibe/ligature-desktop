import { LigatureValue } from "@ligature/ligature-components";
import {LitElement, css, html} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import { State } from "./StoreProvider";

@customElement('result-panel')
export class ResultPanel extends LitElement {
  static styles = css`
  `;

  private state: State | null = null

  // Render the UI as a function of component state
  render() {
    return html`<div id="body"><ligature-value value=${this.state?.resultContent}></ligature-value></div>`;
  }
}
