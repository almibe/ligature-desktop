// import { Header } from '../components/Header.tsx';
import { ResultPanel } from './ResultPanel.ts';
// import { StoreProvider } from './StoreProvider.tsx';
// import { Editor } from './Editor.tsx';
// import { LigatureValue } from "@ligature/ligature-components";
import {LitElement, css, html} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import { State } from "./StoreProvider";

@customElement('main-app')
export class MainApp extends LitElement {
  static styles = css`
  `;

  private state: State | null = null

  // Render the UI as a function of component state
  render() {
    return html`
    <div>
      LigatureDesktop
      <result-panel></result-panel>
    </div>    
    `;
  }
}
