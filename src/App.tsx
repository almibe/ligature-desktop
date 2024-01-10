import { SourcesPanel } from "./SourcesPanel.tsx";
import { EditorPanel } from "./EditorPanel.tsx";
import '@shoelace-style/shoelace/dist/themes/light.css';
import '@shoelace-style/shoelace/dist/components/button/button.js';
import '@shoelace-style/shoelace/dist/components/split-panel/split-panel.js';

function App() {
  return (
    <sl-split-panel id="main">
      <div 
          slot="start"
          style="height: 100%;">
        <SourcesPanel />
      </div>
      <div slot="end" style="height:100%">
        <EditorPanel />
      </div>
    </sl-split-panel>
  );
}

export default App;
