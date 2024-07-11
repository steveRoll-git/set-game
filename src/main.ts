import "./style.css"
import { Application, Assets, Spritesheet } from "pixi.js"
import { Group } from "tweedle.js"
import { GameContainer, totalBoardWidth } from "./Game"

let cardsSheet: Spritesheet

export const getSymbolTexture = (shape: number, fill: number) =>
  cardsSheet.textures[`symbols/${shape}${fill}.png`]

{
  ;(async () => {
    const app = new Application()

    const gameContainer = document.getElementById("game-container")!

    await app.init({
      resizeTo: gameContainer,
      autoDensity: true,
      resolution: window.devicePixelRatio,
      antialias: true,
      backgroundColor: 0xc4c4c4,
    })

    cardsSheet = await Assets.load("assets/cards/cards.json")

    gameContainer.appendChild(app.canvas)

    const game = new GameContainer()
    app.stage.addChild(game)

    const updateSize = () => {
      game.scale.set(app.renderer.width / totalBoardWidth)
    }
    updateSize()

    new ResizeObserver(() => {
      updateSize()
    }).observe(app.canvas)

    app.ticker.add(() => {
      Group.shared.update()
    })
  })()
}
