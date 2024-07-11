import { defineConfig, type Plugin, type ResolvedConfig } from "vite"
import { AssetPack, AssetPackConfig } from "@assetpack/core"
import path from "path"
import { texturePacker } from "@assetpack/plugin-texture-packer"

function assetpackPlugin(): Plugin {
  const apConfig: AssetPackConfig = {
    entry: "./assets",
    plugins: {
      texturePacker: texturePacker({
        resolutionOptions: { template: "", resolutions: { default: 1 } },
      }),
    },
  }
  let mode: ResolvedConfig["command"]
  let ap: AssetPack | undefined

  return {
    name: "vite-plugin-assetpack",
    configResolved(resolvedConfig) {
      mode = resolvedConfig.command
      if (!resolvedConfig.publicDir) return
      if (apConfig.output) return
      const publicDir = resolvedConfig.publicDir.replace(
        path.normalize(process.cwd()),
        ""
      )
      apConfig.output = path.join(publicDir, "assets")
    },
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
