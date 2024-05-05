import { Body } from './Body.tsx';
import { StoreProvider } from './StoreProvider.tsx';

export function App() {
  return <StoreProvider>
      <Body></Body>
  </StoreProvider>
}
