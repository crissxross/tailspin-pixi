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
            name: "scene1",
            assets: {
                "storytext": "assets/tailspinScenes.json",
                "innerEar": "assets/innerEar@2x.png",
                "animalcrossing": "assets/spritesheets/animalcrossing.json",
                "tinkling-chimes": "assets/sounds/TinklingChimes.mp3",
                "cutleryonplates2": "assets/sounds/cutleryonplates2.mp3",
                "waves-hiSoft1": "assets/sounds/waves-hiSoft1.mp3",
            }
        },
        {
            name: "scene2",
            assets: {
                "storytext": "assets/tailspinScenes.json",
                "sky" : "assets/sky.png",
                "animalcrossing": "assets/spritesheets/animalcrossing.json",
                "explosions": "assets/spritesheets/explosions.json",
            }
        }
    ]
}
