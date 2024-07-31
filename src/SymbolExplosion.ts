import { Container, Sprite, TickerCallback } from "pixi.js"
import { app, getSymbolTexture } from "./main"
import { cardColors } from "./CardSprite"
import { random, randomInt } from "./random"

const minSymbols = 5
const maxSymbols = 10

const gravity = 0.5

class Particle extends Sprite {
  dx: number = 0
  dy: number = 0
  dr: number = 0

  update(dt: number) {
    this.dy += gravity * dt
    this.x += this.dx * dt
    this.y += this.dy * dt
    this.rotation += this.dr * dt
  }
}

export class SymbolExplosion extends Container<Particle> {
  constructor() {
    super()
    const numSymbols = randomInt(minSymbols, maxSymbols)
    for (let i = 0; i < numSymbols; i++) {
      const symbol = new Particle(
        getSymbolTexture(randomInt(0, 3), randomInt(0, 3))
      )
      symbol.anchor.set(0.5)
      symbol.scale.set(0.8)
      symbol.tint = cardColors[randomInt(0, 3)]
      symbol.rotation = random(0, Math.PI * 2)
      symbol.dx = random(-5, 5)
      symbol.dy = random(-15, -5)
      symbol.dr = random(-0.1, 0.1)
      this.addChild(symbol)
    }

    const tickHandler: TickerCallback<any> = (time) => {
      for (const particle of this.children) {
        particle.update(time.deltaTime)
      }
    }

    app.ticker.add(tickHandler)
    setTimeout(() => {
      this.removeFromParent()
      app.ticker.remove(tickHandler)
      if (app.ticker.count <= 1) {
        app.ticker.stop()
      }
    }, 3000)
  }
}
