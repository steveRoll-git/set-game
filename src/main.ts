import "./style.css"
import { Application, Container } from "pixi.js"
import { loadSymbolImages } from "./symbolImages"
import { cardHeight, cardWidth, createCardSprite } from "./createCardSprite"

const numCardsOnTable = 12

const boardWidth = 3
const boardHeight = 4
const cardGap = 6

/**
 * The 4 attributes that make up a card - amount, color, shape and fill. Each one is an integer from 0 to 3.
 */
export type Card = [number, number, number, number]

/**
 * An object describing the current state of the game.
 */
type GameState = {
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
}

function newState(): GameState {
  const deck: Card[] = []
  for (let a = 0; a < 3; a++) {
    for (let b = 0; b < 3; b++) {
      for (let c = 0; c < 3; c++) {
        for (let d = 0; d < 3; d++) {
          deck.splice(Math.floor(Math.random() * deck.length), 0, [a, b, c, d])
        }
      }
    }
  }

  const cards: Card[] = []

  for (let i = 0; i < numCardsOnTable; i++) {
    cards.push(deck.pop()!)
  }

  return {
    deck,
    setsFound: 0,
    cards,
  }
}
;(async () => {
  const app = new Application()

  await app.init({
    width: window.innerWidth,
    height: window.innerHeight,
    resizeTo: window,
    autoDensity: true,
    resolution: window.devicePixelRatio,
    antialias: true,
  })

  await loadSymbolImages()

  document.body.appendChild(app.canvas)

  const state = newState()

  const tableCards = new Container()

  for (let i = 0; i < state.cards.length; i++) {
    const card = state.cards[i]
    const x = i % boardWidth
    const y = Math.floor(i / boardWidth)
    const cardSprite = createCardSprite(card)
    tableCards.addChild(cardSprite)
    cardSprite.x = x * (cardWidth + cardGap) + cardWidth / 2
    cardSprite.y = y * (cardHeight + cardGap) + cardHeight / 2
  }

  app.stage.addChild(tableCards)
})()
