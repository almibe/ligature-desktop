import "./styles.css";
import App from "./App.svelte";
import "../node_modules/@shoelace-style/shoelace/cdn/themes/light.css";
import "../node_modules/@shoelace-style/shoelace/dist/shoelace";

const app = new App({
  target: document.getElementById("app"),
});

export default app;
