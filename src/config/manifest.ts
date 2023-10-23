import type { AssetsManifest } from "pixi.js";

// TODO: group assets by scene

export const manifest: AssetsManifest = {
    bundles: [
        {
            name: "logo",
            assets: {
                "viteLogo": "assets/logo/vite.svg",
                "pixiLogo": "assets/logo/pixi.svg",
            }
        },
        {
            name : "images",
            assets: {
                "sky" : "assets/sky.png",
                "innerEar": "assets/innerEar@2x.png",
            }
        },
        {
            name: "spritesheets",
            assets: {
                "explosions": "assets/spritesheets/explosions.json",
            }
        },
        {
            name: "sounds",
            assets: {
                "tinkling-chimes" : "assets/sounds/TinklingChimes.mp3",
            }
        },
        {
            name: "storytext",
            assets: {
                "storytext": "assets/tailspinScenes.json",
            }
        }
    ]
}
