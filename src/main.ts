import "./style.css"
import { Application, Assets, Spritesheet } from "pixi.js"
import { Group } from "tweedle.js"
import { GameContainer } from "./GameContainer"

/**
 * The 4 attributes that make up a card - amount, color, shape and fill. Each one is an integer from 0 to 3.
 */
export type Card = [number, number, number, number]

let cardsSheet: Spritesheet

export const getSymbolTexture = (shape: number, fill: number) =>
  cardsSheet.textures[`symbols/${shape}${fill}.png`]

{
  ;(async () => {
    const app = new Application()

    await app.init({
      width: window.innerWidth,
      height: window.innerHeight,
      resizeTo: window,
      autoDensity: true,
      resolution: window.devicePixelRatio,
      antialias: true,
      backgroundColor: 0xc4c4c4,
    })

    cardsSheet = await Assets.load("assets/cards/cards.json")

    document.body.appendChild(app.canvas)

    const game = new GameContainer()

    app.stage.addChild(game)

    app.ticker.add(() => {
      Group.shared.update()
    })
  })()
}
