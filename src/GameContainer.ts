import { Container } from "pixi.js"
import { Card } from "./main"
import { cardHeight, CardSprite, cardWidth } from "./CardSprite"

const numCardsOnTable = 12

const boardWidth = 3
const cardGap = 6

export class GameContainer extends Container {
  /**
   * The number of sets found so far.
   */
  setsFound: number

  /**
   * The cards that are currently on the table.
   */
  cards: Card[]

  /**
   * The cards in the deck that haven't been placed yet.
   */
  deck: Card[]

  constructor() {
    super()
    this.deck = []
    for (let a = 0; a < 3; a++) {
      for (let b = 0; b < 3; b++) {
        for (let c = 0; c < 3; c++) {
          for (let d = 0; d < 3; d++) {
            this.deck.splice(Math.floor(Math.random() * this.deck.length), 0, [
              a,
              b,
              c,
              d,
            ])
          }
        }
      }
    }

    this.cards = []

    for (let i = 0; i < numCardsOnTable; i++) {
      this.cards.push(this.deck.pop()!)
    }

    this.setsFound = 0

    for (let i = 0; i < this.cards.length; i++) {
      const card = this.cards[i]
      const x = i % boardWidth
      const y = Math.floor(i / boardWidth)
      const cardSprite = new CardSprite(card)
      this.addChild(cardSprite)
      cardSprite.x = x * (cardWidth + cardGap) + cardWidth / 2
      cardSprite.y = y * (cardHeight + cardGap) + cardHeight / 2
    }
  }
}
