import "./style.css"
import { Application, Assets, Spritesheet } from "pixi.js"
import { Group } from "tweedle.js"
import {
  GameContainer,
  hintToString,
  totalBoardHeight,
  totalBoardWidth,
} from "./Game"

export const app = new Application()

let cardsSheet: Spritesheet

export let bottomStatus: HTMLElement
export let setCountText: HTMLElement
export let hintBox: HTMLElement

export const getSymbolTexture = (shape: number, fill: number) =>
  cardsSheet.textures[`symbols/${shape}${fill}.png`]

function showHint(hint: string) {
  hintBox.style.display = "block"
  hintBox.innerHTML = hint
}

{
  ;(async () => {
    const gameContainer = document.getElementById("canvas-container")!
    bottomStatus = document.getElementById("bottom-status")!
    setCountText = document.getElementById("set-count-text")!
    hintBox = document.getElementById("hint-box")!
    const hintButton = document.getElementById("hint-button")!

    await app.init({
      resizeTo: gameContainer,
      autoDensity: true,
      resolution: window.devicePixelRatio,
      antialias: window.devicePixelRatio <= 1,
      backgroundColor: 0xc4c4c4,
    })

    app.ticker.autoStart = false
    app.ticker.stop()

    cardsSheet = await Assets.load("assets/cards.json")

    gameContainer.appendChild(app.canvas)

    const game = new GameContainer()
    app.stage.addChild(game)

    const updateSize = () => {
      app.resize()
      const scale = app.renderer.width / totalBoardWidth
      game.scale.set(scale)
      game.y = app.renderer.height / 2 - (totalBoardHeight / 2) * scale
      app.render()
    }
    updateSize()

    new ResizeObserver(() => {
      updateSize()
    }).observe(app.canvas)

    const tweenLoop = () => {
      Group.shared.update()
      requestAnimationFrame(tweenLoop)
    }
    tweenLoop()

    hintButton.addEventListener("click", () => {
      showHint(hintToString(game.currentHint))
    })

    document.addEventListener("mousedown", () => {
      if (hintBox.style.display == "block") {
        hintBox.style.display = "none"
      }
    })
  })()
}
