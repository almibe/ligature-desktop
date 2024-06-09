import { Header } from '../components/Header.tsx';
import { Result } from './Result.tsx';
import { StoreProvider } from './StoreProvider.tsx';
import { Editor } from './Editor.tsx';

export function App() {
  return <StoreProvider>
    <div>
      <Header></Header>
      <Editor></Editor>
      <Result></Result>
    </div>
  </StoreProvider>
}
