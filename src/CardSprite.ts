import { BlurFilter, Container, Graphics, Sprite } from "pixi.js"
import { Card, getSymbolTexture } from "./main"
import { Tween } from "tweedle.js"

export const cardWidth = 166
export const cardHeight = 109
const colors = [0xed1c24, 0x16a751, 0x613394]
const symbolPadding = 10

const hoverOffset = 2
const selectedOffset = 6
const hoverAnimDuration = 65

export class CardSprite extends Container {
  selected: boolean

  constructor(card: Card) {
    super()

    const shadow = new Graphics()
    shadow.roundRect(0, 0, cardWidth, cardHeight, 12).fill("00000055")
    const shadowBlurFilter = new BlurFilter({ strength: 2 })
    shadow.filters = [shadowBlurFilter]
    shadow.pivot.x = cardWidth / 2
    shadow.pivot.y = cardHeight / 2
    shadow.x = cardWidth / 2
    shadow.y = cardHeight / 2
    this.addChild(shadow)

    const cardContent = new Container()

    const graphics = new Graphics()
    graphics.roundRect(0, 0, cardWidth, cardHeight, 12).fill(0xffffff)
    cardContent.addChild(graphics)

    const symbolContainer = new Container()
    for (let i = 0; i <= card[0]; i++) {
      const symbolSprite = new Sprite(getSymbolTexture(card[2], card[3]))
      symbolSprite.x = i * (symbolSprite.width + symbolPadding)
      symbolContainer.addChild(symbolSprite)
    }
    symbolContainer.tint = colors[card[1]]
    cardContent.addChild(symbolContainer)
    symbolContainer.x = this.width / 2 - symbolContainer.width / 2
    symbolContainer.y = this.height / 2 - symbolContainer.height / 2

    const selectionOutline = new Graphics()
    selectionOutline
      .roundRect(0, 0, cardWidth, cardHeight, 12)
      .stroke({ width: 6, alignment: 1, color: 0x84d4ff })
    selectionOutline.alpha = 0
    cardContent.addChild(selectionOutline)

    this.addChild(cardContent)

    this.pivot.x = cardWidth / 2
    this.pivot.y = cardHeight / 2

    this.selected = false
    this.eventMode = "static"

    this.on("mouseover", (_e) => {
      if (!this.selected) {
        new Tween(cardContent)
          .to({ x: -hoverOffset, y: -hoverOffset }, hoverAnimDuration)
          .start()
      }
    })

    this.on("mouseout", (_e) => {
      if (!this.selected) {
        new Tween(cardContent).to({ x: 0, y: 0 }, hoverAnimDuration).start()
      }
    })

    this.on("pointerdown", (e) => {
      const isTouch = e.pointerType == "touch"
      this.selected = !this.selected
      if (this.selected) {
        new Tween(cardContent)
          .to({ x: -selectedOffset, y: -selectedOffset }, hoverAnimDuration)
          .start()
        new Tween(shadowBlurFilter).to({ blur: 6 }, hoverAnimDuration).start()
        new Tween(shadow.scale)
          .to({ x: 1.05, y: 1.05 }, hoverAnimDuration)
          .start()
        new Tween(selectionOutline).to({ alpha: 1 }, hoverAnimDuration).start()
      } else {
        new Tween(cardContent)
          .to(
            { x: isTouch ? 0 : -hoverOffset, y: isTouch ? 0 : -hoverOffset },
            hoverAnimDuration
          )
          .start()
        new Tween(shadowBlurFilter).to({ blur: 2 }, hoverAnimDuration).start()
        new Tween(shadow.scale).to({ x: 1, y: 1 }, hoverAnimDuration).start()
        new Tween(selectionOutline).to({ alpha: 0 }, hoverAnimDuration).start()
      }
    })
  }
}
