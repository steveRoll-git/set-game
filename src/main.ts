import "./style.css";
import { Application } from "pixi.js";

(async () => {
  const app = new Application();

  await app.init({
    width: window.innerWidth,
    height: window.innerHeight,
    resizeTo: window,
    autoDensity: true,
    resolution: window.devicePixelRatio,
  });

  document.body.appendChild(app.canvas);
})();
