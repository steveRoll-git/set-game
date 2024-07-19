import { Container } from "pixi.js"
import { cardHeight, CardSprite, cardWidth } from "./CardSprite"
import { Easing } from "tweedle.js"
import { bottomStatus, setCountText } from "./main"
import { MonitoredTween as Tween } from "./MonitoredTween"
import { pluralNoun } from "./pluralNoun"

/**
 * The 4 attributes that make up a card - amount, color, shape and fill. Each one is an integer from 0 to 2.
 */
export type Card = [number, number, number, number]

export type Hint = {
  /**
   * Which attribute this hint is about (0 - 3)
   */
  attribute: number
  /**
   * Whether `attribute` in the hinted set's cards is equal or different in all cards
   */
  equality: boolean
}

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

const getAllSets = (cards: Card[]) => {
  const sets = []
  for (let i = 0; i < cards.length - 2; i++) {
    for (let j = i + 1; j < cards.length - 1; j++) {
      for (let k = j + 1; k < cards.length; k++) {
        const set = [cards[i], cards[j], cards[k]]
        if (isSet(set)) {
          sets.push(set)
        }
      }
    }
  }
  return sets
}

export const cardAttributeNames = ["amounts", "colors", "shapes", "fills"]
export const equalityStrings = new Map<boolean, string>([
  [false, "different"],
  [true, "the same"],
])

export const hintToString = (hint: Hint) =>
  `Three cards with <b>${equalityStrings.get(hint.equality)} ${
    cardAttributeNames[hint.attribute]
  }</b> make a set here`

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

  currentHint: Hint = { equality: false, attribute: 0 }

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
    this.updateStatusText(this.deck.length)

    setCountText.innerText = "0"

    this.cards = []

    for (let i = 0; i < numCardsOnTable; i++) {
      this.addCard(i, i * 60, i == numCardsOnTable - 1)
    }

    this.setsFound = 0
  }

  addCard(index: number, appearDelay: number, finalCard: boolean = false) {
    let card
    if (finalCard) {
      // Go through every remaining card in the deck and place it in the new spot until a set can be found.
      const testBoard = this.cards.map((c) => c.card)
      let chosenCard
      let chosenIndex = -1
      do {
        chosenIndex++
        chosenCard = this.deck[chosenIndex]
        testBoard[index] = chosenCard
      } while (getAllSets(testBoard).length == 0)
      card = this.deck.splice(chosenIndex, 1)[0]
    } else {
      card = this.deck.pop()!
    }
    const newCardCount = this.deck.length
    const cardSprite = new CardSprite(card, index)
    this.addChild(cardSprite)
    this.cardAppearAnimation(cardSprite, appearDelay).onAfterDelay(() => {
      this.updateStatusText(newCardCount)
    })

    cardSprite.onSelect = () => {
      this.selectedCards.add(cardSprite)
      this.checkSet()
    }

    cardSprite.onDeselect = () => {
      this.selectedCards.delete(cardSprite)
    }

    this.cards[index] = cardSprite

    if (finalCard) {
      this.generateHint()
    }
  }

  checkSet() {
    if (this.selectedCards.size == 3) {
      const setCards = [...this.selectedCards.values()].sort(
        (a, b) => a.index - b.index
      )
      if (isSet(setCards.map((s) => s.card))) {
        for (const [i, card] of setCards.entries()) {
          card.playCorrectAnimation()

          if (this.deck.length > 0) {
            this.addCard(card.index, 900 + setCards.indexOf(card) * 70, i == 2)
          }
        }
        this.setsFound += 1
        setCountText.innerText = this.setsFound.toString()
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
    return new Tween(card)
      .to(toProps, 500)
      .easing(Easing.Quintic.Out)
      .delay(delay)
      .start()
      .onComplete(() => {
        card.zIndex = card.index
      })
  }

  updateStatusText(cards: number) {
    if (cards == 0) {
      const sets = getAllSets(this.cards.filter((c) => c).map((c) => c.card))
      bottomStatus.innerText = `No cards left - ${pluralNoun(
        sets.length,
        "set",
        "remain"
      )}`
    } else {
      bottomStatus.innerText = `${cards} cards left`
    }
  }

  /**
   * Attempts to generate the most helpful hint for the current board.
   */
  generateHint() {
    const sets = getAllSets(this.cards.map((c) => c.card))
    // First, we try to find a set that has at least one attribute that is equal in all its cards.
    // These are the easiest to find.
    const setEqualities = sets.map((set) =>
      Array.from({ length: 4 }, (_, i) => set[0][i] == set[1][i])
    )
    const equalSet = setEqualities.find((set) => set.includes(true))
    if (equalSet) {
      this.currentHint = { equality: true, attribute: equalSet.indexOf(true) }
    } else {
      // If there are no sets that have an equal attribute in all cards (i.e. all current sets have all-different attributes),
      // we find the attribute that has the least variants.
      // (This isn't very helpful if all attributes have the same variance)
      const attributeCounts = Array.from({ length: 4 }, () =>
        new Array<number>(3).fill(0)
      )
      for (const card of this.cards) {
        for (const [attribute, value] of card.card.entries()) {
          attributeCounts[attribute][value] += 1
        }
      }
      const bestAttribute = attributeCounts
        .map((subArray, index) => ({ min: Math.min(...subArray), index }))
        .reduce((lowest, current) =>
          current.min < lowest.min ? current : lowest
        ).index
      this.currentHint = { equality: false, attribute: bestAttribute }
    }
  }
}
