import { defineConfig, type Plugin, type ResolvedConfig } from "vite"
import { AssetPack, AssetPackConfig } from "@assetpack/core"
import { texturePacker } from "@assetpack/core/texture-packer"

function assetpackPlugin(): Plugin {
  const apConfig: AssetPackConfig = {
    entry: "./assets",
    output: "./public/assets",
    pipes: [
      texturePacker({
        resolutionOptions: { template: "", resolutions: { default: 1 } },
      }),
    ],
  }

  let mode: ResolvedConfig["command"]
  let ap: AssetPack | undefined

  return {
    name: "vite-plugin-assetpack",
    buildStart: async () => {
      if (mode === "serve") {
        if (ap) return
        ap = new AssetPack(apConfig)
        void ap.watch()
      } else {
        await new AssetPack(apConfig).run()
      }
    },
    buildEnd: async () => {
      if (ap) {
        await ap.stop()
        ap = undefined
      }
    },
  }
}

export default defineConfig({
  server: {
    hmr: true,
  },
  plugins: [assetpackPlugin()],
})
