import { initializeEditor } from '@ligature/ligature-components/src/editor/ligature-editor';
import {LitElement, css, html} from 'lit';
import {customElement, property} from 'lit/decorators.js';

@customElement('notebook-content')
export class NotebookContent extends LitElement {
  static styles = css`
  `;

  @property()
  private pages = ["test"]

  protected createRenderRoot() {
    return this;
  }

  render() {
    let pages = this.pages.map(page => html`<li><a href="">${page}</a></li>`)

    setTimeout(() => {
        initializeEditor({
            element: document.querySelector("#editor")!!,
            onRun: (text) => {},
            onChange: (text) => {}
        })
    })

    return html`
        <div></div>
    `;
  }
}
