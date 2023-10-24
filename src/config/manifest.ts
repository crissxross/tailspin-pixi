import type { AssetsManifest } from "pixi.js";

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
            name: "loader-scene",
            assets: {
                // "loadingSpinner": "assets/loading-spinner.svg",
            }
        },
        {
            name: "game-scene1",
            assets: {
                "storytext": "assets/tailspinScenes.json",
                "innerEar": "assets/innerEar@2x.png",
                "tinkling-chimes": "assets/sounds/TinklingChimes.mp3",
            }
        },
        {
            name: "game-scene2",
            assets: {
                "storytext": "assets/tailspinScenes.json",
                "sky" : "assets/sky.png",
                "explosions": "assets/spritesheets/explosions.json",
            }
        }
    ]
}
