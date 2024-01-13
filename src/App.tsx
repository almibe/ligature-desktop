import { SourcesPanel } from "./SourcesPanel.tsx";
import { ShellPanel } from "./ShellPanel.tsx";
import '@shoelace-style/shoelace/dist/themes/light.css';
import '@shoelace-style/shoelace/dist/components/button/button.js';
import '@shoelace-style/shoelace/dist/components/split-panel/split-panel.js';

function App() {
  return (
      <div>
        <ShellPanel />
      </div>
  );
}

export default App;
