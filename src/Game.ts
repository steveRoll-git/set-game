import { Container } from "pixi.js"
import { cardHeight, CardSprite, cardWidth } from "./CardSprite"
import { Easing, Tween } from "tweedle.js"

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
const boardHeight = 4
const cardGap = 6
const outerPadding = 8

export const totalBoardWidth =
  boardWidth * (cardWidth + cardGap) - cardGap + outerPadding * 2
export const totalBoardHeight =
  boardHeight * (cardHeight + cardGap) - cardGap + outerPadding * 2

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

  cardPosition(x: number, y: number) {
    return {
      x: outerPadding + x * (cardWidth + cardGap) + cardWidth / 2,
      y: outerPadding + y * (cardHeight + cardGap) + cardHeight / 2,
    }
  }

  constructor() {
    super()
    this.deck = []
    for (let a = 0; a < 3; a++) {
      for (let b = 0; b < 3; b++) {
        for (let c = 0; c < 3; c++) {
          for (let d = 0; d < 3; d++) {
            this.deck.splice(
              Math.floor(Math.random() * (this.deck.length + 1)),
              0,
              [a, b, c, d]
            )
          }
        }
      }
    }

    this.cards = []

    for (let i = 0; i < numCardsOnTable; i++) {
      this.addCard(this.deck.pop()!, i, i * 60)
    }

    this.setsFound = 0
  }

  addCard(card: Card, index: number, appearDelay: number) {
    const cardSprite = new CardSprite(card, index)
    this.addChild(cardSprite)
    this.cardAppearAnimation(cardSprite, appearDelay)

    cardSprite.onSelect = () => {
      this.selectedCards.add(cardSprite)
      this.checkSet()
    }

    cardSprite.onDeselect = () => {
      this.selectedCards.delete(cardSprite)
    }

    this.cards[index] = cardSprite
  }

  checkSet() {
    if (this.selectedCards.size == 3) {
      const setCards = [...this.selectedCards.values()].sort(
        (a, b) => a.index - b.index
      )
      if (isSet(setCards.map((s) => s.card))) {
        for (const card of setCards) {
          card.zIndex = 50
          card.playCorrectAnimation()

          this.addCard(
            this.deck.pop()!,
            card.index,
            900 + setCards.indexOf(card) * 70
          )
        }
      } else {
        for (const card of setCards) {
          card.playWrongAnimation()
        }
      }
      this.selectedCards.clear()
    }
  }

  cardAppearAnimation(card: CardSprite, delay: number = 0) {
    const x = card.index % boardWidth
    const y = Math.floor(card.index / boardWidth)
    card.x = totalBoardWidth + cardWidth
    card.y = totalBoardHeight + cardHeight
    card.zIndex = 50
    const toProps = this.cardPosition(x, y)
    new Tween(card)
      .to(toProps, 500)
      .easing(Easing.Quintic.Out)
      .delay(delay)
      .start()
      .onComplete(() => {
        card.zIndex = card.index
      })
  }
}
