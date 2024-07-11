import '@shoelace-style/shoelace/dist/themes/light.css';
import '@shoelace-style/shoelace/dist/components/input/input.js';
import '@shoelace-style/shoelace/dist/components/select/select.js';
import '@shoelace-style/shoelace/dist/components/option/option.js';
import '@shoelace-style/shoelace/dist/components/button/button.js';
import '@shoelace-style/shoelace/dist/components/button-group/button-group.js';
import '@shoelace-style/shoelace/dist/components/icon/icon.js';
import '@shoelace-style/shoelace/dist/components/icon-button/icon-button.js';
import '@shoelace-style/shoelace/dist/components/dialog/dialog.js';

import playIcon from '../../icons/play.svg';
import questionIcon from '../../icons/question.svg';
import markdownIcon from '../../icons/markdown.svg';

import { useContext } from 'solid-js';
import { StoreContext } from '../StoreProvider';

export function Header() {
  const store = useContext(StoreContext);
  return <>
      <div id='header'>
            <sl-icon-button src={playIcon} onclick={run}></sl-icon-button>
            <sl-icon-button src={questionIcon} onclick={help}></sl-icon-button>
            <sl-icon-button src={markdownIcon} onclick={markdownEditor}></sl-icon-button>
            <select id="display" onChange={(e) => {
              const selected = e.currentTarget.value
              store.setSelected(selected)
            }}>
              <option value="text">Text</option>
              <option value="table">Table</option>
              <option value="graph">Graph</option>
            </select>
      </div>

      <sl-dialog label='Help' id='help-dialog' style='--width: 50vw;'>
        <p>Help!</p>
      </sl-dialog>

      <sl-dialog label='Markdown Editor' id='markdown-dialog' style='--width: 50vw;'>
        <textarea></textarea>
        <sl-button>Inject</sl-button>
      </sl-dialog>
  </>;

  async function run() {
    store.run()
  }

  function help() {
    document.querySelector('#help-dialog').show();
  }

  function markdownEditor() {
    document.querySelector('#markdown-dialog').show();
  }
}
