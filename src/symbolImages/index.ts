import { Assets, Texture } from "pixi.js"

/**
 * How many variants each feature has.
 */
const numVariants = 3

const symbolImages = new Map<string, Texture>()

export const getSymbolTexture = (shape: number, fill: number) =>
  symbolImages.get(`${shape}${fill}`)

export const loadSymbolImages = async () => {
  for (let i = 0; i < numVariants; i++) {
    for (let j = 0; j < numVariants; j++) {
      symbolImages.set(
        `${i}${j}`,
        await Assets.load(new URL(`${i}${j}.png`, import.meta.url).href)
      )
    }
  }
}
