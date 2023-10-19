import type { AssetsManifest } from "pixi.js";

export const manifest: AssetsManifest = {
    bundles: [
        {
            name: "logo",
            assets: {
                "viteLogo": "logo/vite.svg",
                "pixiLogo": "logo/pixi.svg",
            }
        },
        {
            name : "images",
            assets: {
                "sky" : "images/sky.png",
            }
        },
        {
            name: "spritesheets",
            assets: {
                "explosions": "spritesheets/explosions.json",
            }
        },
        {
            name: "sound",
            assets: {
                "tinkling-chimes" : "sound/TinklingChimes.mp3",
            }
        }
    ]
}
