import { Header } from '../components/Header.tsx';
import { Body } from './Body.tsx';
import { StoreProvider } from './StoreProvider.tsx';
import { Editor } from './Editor.tsx';

export function App() {
  return <StoreProvider>
      <Header></Header>
      <Editor></Editor>
      <Body></Body>
  </StoreProvider>
}
