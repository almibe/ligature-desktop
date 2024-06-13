import { initializeEditor } from "@ligature/ligature-components/src/editor/ligature-editor"
import { State } from "./StoreProvider";
import { LigatureValue } from "@ligature/ligature-components";
import {LitElement, css, html} from 'lit';
import {customElement, property, query} from 'lit/decorators.js';

@customElement('editor-panel')
export class EditorPanel extends LitElement {
  static styles = css`
  `;

  private state: State | null = null

  private editor: any;

  @query("#editor")
  private _editor: HTMLElement;

  // Render the UI as a function of component state
  render() {
    setTimeout(() => {
        this.editor = initializeEditor({
          element: this._editor,
          onRun: async (script) => {
//            store.run()
          },
          onChange: (script) => {
//            store.setEditorContent(script)
          }
        })
      }
    );
  
    return html`
      <div id="editorWrapper">
        <div id="editor"></div>
      </div>
    `;
  }
}
