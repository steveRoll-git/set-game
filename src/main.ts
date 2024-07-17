import "./style.css"
import { Application, Assets, Spritesheet } from "pixi.js"
import { Group } from "tweedle.js"
import { GameContainer, totalBoardHeight, totalBoardWidth } from "./Game"

let cardsSheet: Spritesheet

export let bottomStatus: HTMLElement

export const getSymbolTexture = (shape: number, fill: number) =>
  cardsSheet.textures[`symbols/${shape}${fill}.png`]

{
  ;(async () => {
    const app = new Application()

    const gameContainer = document.getElementById("canvas-container")!
    bottomStatus = document.getElementById("bottom-status")!

    await app.init({
      resizeTo: gameContainer,
      autoDensity: true,
      resolution: window.devicePixelRatio,
      antialias: window.devicePixelRatio <= 1,
      backgroundColor: 0xc4c4c4,
    })

    cardsSheet = await Assets.load("assets/cards.json")

    gameContainer.appendChild(app.canvas)

    const game = new GameContainer()
    app.stage.addChild(game)

    const updateSize = () => {
      const scale = app.renderer.width / totalBoardWidth
      game.scale.set(scale)
      game.y = app.renderer.height / 2 - (totalBoardHeight / 2) * scale
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
