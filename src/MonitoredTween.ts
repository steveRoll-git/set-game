import { Tween } from "tweedle.js"
import { app } from "./main"

let runningTweens = 0

/**
 * An extension of tweedle.js' Tween that starts/stops the app's ticker, so that re-renders will happen only when tweens are animating.
 */
export class MonitoredTween<T> extends Tween<T> {
  secondaryOnComplete?: (object: T, tween: this) => void

  constructor(object: T) {
    super(object)

    super.onComplete((object, tween) => {
      runningTweens -= 1
      this.secondaryOnComplete?.(object, tween)
      if (runningTweens == 0 && app.ticker.started) {
        setTimeout(() => {
          app.ticker.stop()
        }, 1)
      }
    })
  }

  start() {
    super.start()
    runningTweens += 1
    if (!app.ticker.started) {
      app.ticker.start()
    }
    return this
  }

  onComplete(callback: (object: T, tween: this) => void): this {
    this.secondaryOnComplete = callback
    return this
  }
}
