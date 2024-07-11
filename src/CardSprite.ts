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

const outlineColors = {
  selected: 0x84d4ff,
  wrong: 0xff4444,
}

export class CardSprite extends Container {
  selected: boolean
  onSelect?: () => void
  onDeselect?: () => void

  enabled: boolean = true

  shadow: Graphics
  shadowBlurFilter: BlurFilter
  selectionOutline: Graphics
  cardContent: Container
  cardHoverTween?: Tween<Container>
  wrongShakeTween?: Tween<Container>

  constructor(card: Card) {
    super()

    this.shadow = new Graphics()
    this.shadow.roundRect(0, 0, cardWidth, cardHeight, 12).fill("00000055")
    this.shadowBlurFilter = new BlurFilter({ strength: 2 })
    this.shadow.filters = [this.shadowBlurFilter]
    this.shadow.pivot.x = cardWidth / 2
    this.shadow.pivot.y = cardHeight / 2
    this.shadow.x = cardWidth / 2
    this.shadow.y = cardHeight / 2
    this.addChild(this.shadow)

    this.cardContent = new Container()

    const graphics = new Graphics()
    graphics.roundRect(0, 0, cardWidth, cardHeight, 12).fill(0xffffff)
    this.cardContent.addChild(graphics)

    const symbolContainer = new Container()
    for (let i = 0; i <= card[0]; i++) {
      const symbolSprite = new Sprite(getSymbolTexture(card[2], card[3]))
      symbolSprite.x = i * (symbolSprite.width + symbolPadding)
      symbolContainer.addChild(symbolSprite)
    }
    symbolContainer.tint = colors[card[1]]
    this.cardContent.addChild(symbolContainer)
    symbolContainer.x = this.width / 2 - symbolContainer.width / 2
    symbolContainer.y = this.height / 2 - symbolContainer.height / 2

    this.selectionOutline = new Graphics()
    this.selectionOutline
      .roundRect(0, 0, cardWidth, cardHeight, 12)
      .stroke({ width: 6, alignment: 1, color: 0xffffff })
    this.selectionOutline.alpha = 0
    this.cardContent.addChild(this.selectionOutline)

    this.addChild(this.cardContent)

    this.pivot.x = cardWidth / 2
    this.pivot.y = cardHeight / 2

    this.selected = false
    this.eventMode = "static"

    this.on("mouseover", (_e) => {
      if (!this.selected) {
        new Tween(this.cardContent)
          .to({ x: -hoverOffset, y: -hoverOffset }, hoverAnimDuration)
          .start()
      }
    })

    this.on("mouseout", (_e) => {
      if (!this.selected) {
        new Tween(this.cardContent)
          .to({ x: 0, y: 0 }, hoverAnimDuration)
          .start()
      }
    })

    this.on("pointerdown", (e) => {
      if (this.enabled) {
        this.setSelected(!this.selected, e.pointerType == "mouse")
      }
    })
  }

  setSelected(selected: boolean, isMouseEvent: boolean = false) {
    this.selected = selected
    if (this.selected) {
      this.cardHoverTween = new Tween(this.cardContent)
        .to({ x: -selectedOffset, y: -selectedOffset }, hoverAnimDuration)
        .start()
      new Tween(this.shadowBlurFilter)
        .to({ blur: 6 }, hoverAnimDuration)
        .start()
      new Tween(this.shadow.scale)
        .to({ x: 1.05, y: 1.05 }, hoverAnimDuration)
        .start()
      this.selectionOutline.tint = outlineColors.selected
      new Tween(this.selectionOutline)
        .to({ alpha: 1 }, hoverAnimDuration)
        .start()
      this.onSelect?.()
    } else {
      this.cardHoverTween = new Tween(this.cardContent)
        .to(
          {
            x: isMouseEvent ? -hoverOffset : 0,
            y: isMouseEvent ? -hoverOffset : 0,
          },
          hoverAnimDuration
        )
        .start()
      new Tween(this.shadowBlurFilter)
        .to({ blur: 2 }, hoverAnimDuration)
        .start()
      new Tween(this.shadow.scale).to({ x: 1, y: 1 }, hoverAnimDuration).start()
      new Tween(this.selectionOutline)
        .to({ alpha: 0 }, hoverAnimDuration)
        .start()
      this.onDeselect?.()
    }
  }

  playWrongAnimation() {
    this.enabled = true
    this.selectionOutline.tint = outlineColors.wrong
    this.cardHoverTween?.end()
    this.wrongShakeTween = new Tween(this.cardContent)
      .to({ x: hoverOffset }, 65)
      .yoyo(true)
      .repeat(3)
      .start()
      .onComplete(() => {
        setTimeout(() => {
          this.enabled = true
          this.setSelected(false)
        }, 300)
      })
  }
}
