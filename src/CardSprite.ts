import { BlurFilter, Container, Graphics, Sprite } from "pixi.js"
import { Card, getSymbolTexture } from "./main"

export const cardWidth = 166
export const cardHeight = 109
const colors = [0xed1c24, 0x16a751, 0x613394]
const symbolPadding = 10

export class CardSprite extends Container {
  constructor(card: Card) {
    super()

    const shadow = new Graphics()
    shadow.roundRect(0, 0, cardWidth, cardHeight, 12).fill("00000044")
    shadow.filters = [new BlurFilter({ strength: 2 })]
    this.addChild(shadow)

    const graphics = new Graphics()
    graphics.roundRect(0, 0, cardWidth, cardHeight, 12).fill(0xffffff)
    this.addChild(graphics)

    const symbolContainer = new Container()
    for (let i = 0; i <= card[0]; i++) {
      const symbolSprite = new Sprite(getSymbolTexture(card[2], card[3]))
      symbolSprite.x = i * (symbolSprite.width + symbolPadding)
      symbolContainer.addChild(symbolSprite)
    }
    symbolContainer.tint = colors[card[1]]
    this.addChild(symbolContainer)
    symbolContainer.x = this.width / 2 - symbolContainer.width / 2
    symbolContainer.y = this.height / 2 - symbolContainer.height / 2

    this.pivot.x = cardWidth / 2
    this.pivot.y = cardHeight / 2
  }
}
