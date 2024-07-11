import { Wander } from './wander/Wander.tsx';
import { Networks } from './networks/Networks.tsx';
import { StoreProvider } from './StoreProvider.tsx';
import Split from 'split-grid'

export function App() {

  setTimeout(() => {
    Split({
      columnGutters: [{
        track: 1,
        element: document.querySelector('.gutter'),
      }],
    })  
  })

  return <StoreProvider>
    <div id="split-panel">
      <div>
        <Networks></Networks>
      </div>
      <div class="gutter"></div>
      <div>
        <Wander></Wander>
      </div>
    </div>
  </StoreProvider>
}
