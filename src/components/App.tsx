import { Header } from '../components/Header.tsx';
import { Editor } from '../components/Editor.tsx';
import { Results } from '../components/Results.tsx';
import { createSignal } from 'solid-js';

export function App() {
  const [results, setResults] = createSignal("");
  const [editorContent, setEditorContent] = createSignal("");

  return <>
      <Header setResults={setResults} editorContent={editorContent()}></Header>
      <Editor setResults={setResults} setEditorContent={setEditorContent}></Editor>
      <Results results={results()}></Results>
  </>;
}
