import { Container, Graphics, Sprite } from "pixi.js"
import { getSymbolTexture } from "./symbolImages"
import { Card } from "./main"

const cardWidth = 166
const cardHeight = 109
const colors = [0xed1c24, 0x16a751, 0x16a751]
const symbolPadding = 10

export function createCardSprite(card: Card) {
  const container = new Container()

  const graphics = new Graphics()
  graphics.roundRect(0, 0, cardWidth, cardHeight, 12).fill(0xffffff)

  const symbolContainer = new Container()
  for (let i = 0; i <= card[0]; i++) {
    const symbolSprite = new Sprite(getSymbolTexture(card[2], card[3]))
    symbolSprite.x = i * (symbolSprite.width + symbolPadding)
    symbolContainer.addChild(symbolSprite)
  }
  symbolContainer.tint = colors[card[1]]

  container.addChild(graphics)
  container.addChild(symbolContainer)
  symbolContainer.x = container.width / 2 - symbolContainer.width / 2
  symbolContainer.y = container.height / 2 - symbolContainer.height / 2

  container.pivot.x = cardWidth / 2
  container.pivot.y = cardHeight / 2

  return container
}
