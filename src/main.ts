import "./style.css"
import { Application } from "pixi.js"
import { loadSymbolImages } from "./symbolImages"
import { createCardSprite } from "./createCardSprite"

/**
 * The 4 attributes that make up a card - amount, color, shape and fill. Each one is an integer from 0 to 3.
 */
export type Card = [number, number, number, number]
;(async () => {
  const app = new Application()

  await app.init({
    width: window.innerWidth,
    height: window.innerHeight,
    resizeTo: window,
    autoDensity: true,
    resolution: window.devicePixelRatio,
    antialias: true,
  })

  await loadSymbolImages()

  document.body.appendChild(app.canvas)

  const test = createCardSprite([2, 1, 1, 2])
  test.x = 300
  test.y = 200
  app.stage.addChild(test)
})()
