import { BlurFilter, Container, Graphics, Sprite } from "pixi.js"
import { getSymbolTexture } from "./main"
import { Easing, Tween } from "tweedle.js"
import { Card } from "./Game"

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
  correct: 0xffcb11,
}

export class CardSprite extends Container {
  readonly card: Card

  selected: boolean
  onSelect?: () => void
  onDeselect?: () => void

  enabled: boolean = true

  background: Graphics
  shadow: Graphics
  shadowBlurFilter: BlurFilter
  selectionOutline: Graphics
  cardContent: Container
  cardHoverTween?: Tween<Container>

  constructor(card: Card) {
    super()

    this.card = card

    this.shadow = new Graphics()
    this.shadow.roundRect(0, 0, cardWidth, cardHeight, 12).fill("00000055")
    this.shadowBlurFilter = new BlurFilter({ strength: 2 })
    this.shadow.filters = [this.shadowBlurFilter]
    this.shadow.pivot.x = cardWidth / 2
    this.shadow.pivot.y = cardHeight / 2
    this.addChild(this.shadow)

    this.cardContent = new Container()

    this.background = new Graphics()
    this.background.roundRect(0, 0, cardWidth, cardHeight, 12).fill(0xffffff)
    this.cardContent.addChild(this.background)

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

    this.cardContent.pivot.x = cardWidth / 2
    this.cardContent.pivot.y = cardHeight / 2
    this.addChild(this.cardContent)

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
      if (this.enabled && (e.pointerType != "mouse" || e.button == 0)) {
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
    this.enabled = false
    this.selectionOutline.tint = outlineColors.wrong
    this.cardHoverTween?.end()
    new Tween(this.cardContent)
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

  playCorrectAnimation() {
    this.enabled = false
    this.selectionOutline.tint = outlineColors.correct
    this.background.tint = 0xfffbed
    this.cardHoverTween?.end()
    new Tween(this.cardContent)
      .to({ scale: { x: 1.1, y: 1.1 } }, 100)
      .easing(Easing.Cubic.In)
      .start()
      .onComplete(() => {
        const outlineRing = this.selectionOutline.clone(true)
        outlineRing.pivot.x = cardWidth / 2
        outlineRing.pivot.y = cardHeight / 2
        outlineRing.tint = outlineColors.correct
        outlineRing.x = this.x + this.cardContent.x
        outlineRing.y = this.y + this.cardContent.y
        outlineRing.scale.copyFrom(this.cardContent.scale)
        outlineRing.zIndex = 2
        new Tween(outlineRing)
          .to({ scale: { x: 1.4, y: 1.4 }, alpha: 0 }, 1000)
          .easing(Easing.Cubic.Out)
          .start()
          .onComplete(() => {
            this.parent.removeChild(outlineRing)
          })
        this.parent.addChild(outlineRing)
        new Tween(this.cardContent)
          .to({ scale: { x: 1, y: 1 } }, 300)
          .easing(Easing.Sinusoidal.Out)
          .start()
          .onComplete(() => {
            new Tween(this.shadow).to({ alpha: 0 }, 200).start()
            new Tween(this.cardContent)
              .to({ scale: { x: 0, y: 0 } }, 450)
              .easing(Easing.Cubic.In)
              .start()
          })
      })
  }
}
