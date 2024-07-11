import { Container } from "pixi.js"
import { cardHeight, CardSprite, cardWidth } from "./CardSprite"

/**
 * The 4 attributes that make up a card - amount, color, shape and fill. Each one is an integer from 0 to 3.
 */
export type Card = [number, number, number, number]

const isSet = (cards: Card[]) => {
  for (let i = 0; i < 4; i++) {
    if (
      !(
        (cards[0][i] == cards[1][i]) == (cards[1][i] == cards[2][i]) &&
        (cards[0][i] == cards[2][i]) == (cards[1][i] == cards[2][i])
      )
    ) {
      return false
    }
  }
  return true
}

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
  cards: CardSprite[]

  /**
   * The cards in the deck that haven't been placed yet.
   */
  deck: Card[]

  /**
   * The cards that the user has selected.
   */
  selectedCards: Set<CardSprite> = new Set()

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
      const card = this.deck.pop()!
      const x = i % boardWidth
      const y = Math.floor(i / boardWidth)
      const cardSprite = new CardSprite(card)
      this.addChild(cardSprite)
      cardSprite.x = x * (cardWidth + cardGap) + cardWidth / 2
      cardSprite.y = y * (cardHeight + cardGap) + cardHeight / 2

      cardSprite.onSelect = () => {
        this.selectedCards.add(cardSprite)
        if (this.selectedCards.size == 3) {
          if (isSet([...this.selectedCards.values()].map((s) => s.card))) {
            for (const card of this.selectedCards.values()) {
              card.zIndex = 1
              card.playCorrectAnimation()
            }
          } else {
            for (const card of this.selectedCards.values()) {
              card.playWrongAnimation()
            }
          }
          this.selectedCards.clear()
        }
      }

      cardSprite.onDeselect = () => {
        this.selectedCards.delete(cardSprite)
      }

      this.cards.push(cardSprite)
    }

    this.setsFound = 0
  }
}
