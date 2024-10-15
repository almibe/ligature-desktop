import { Wander } from './wander/Wander.tsx';
import { Networks } from './networks/Networks.tsx';
import { StoreProvider } from './StoreProvider.tsx';
import Split from 'split-grid'

export function App() {
  return <StoreProvider>
      <Wander></Wander>
  </StoreProvider>
}
