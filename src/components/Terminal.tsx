import { initializeRepl } from '@ligature/ligature-components/src/repl/repl.ts';
import { useContext } from 'solid-js';
import { runBend } from '../lib/ligature-client';
import { StoreContext } from './StoreProvider';

export function Terminal() {
    let term;
    const store = useContext(StoreContext);
    setTimeout(() => {
      term = initializeRepl(document.querySelector('#terminal'), async (command) => {
        return await runBend(command, new Map())
      });
    });
  
    return <>
        <div id="terminal">
        </div>
    </>;
}
