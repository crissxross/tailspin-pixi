import { Application, DisplayObject } from "pixi.js";

export class SceneManager {
    //class is almost will be static
    private constructor() {};
    private static _app: Application;
    private static _currentScene: IScene;

    // NOTE: I'm setting width & height to fixed values for now to match the original Flash version
    // TODO: make stage size dynamic to fit window again

    public static get width() {
        // return Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
        return 1080;
    }

    public static get height() {
        // return Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
        return 720;
    }

    public static init(bgColor: string, bgAlpha: number): void {
        SceneManager._app = new Application({
            view: document.getElementById("pixi-canvas") as HTMLCanvasElement,
            // resizeTo: window,
            width: SceneManager.width,
            height: SceneManager.height,
            resolution: window.devicePixelRatio || 1,
            autoDensity: true,
            backgroundColor: bgColor,
            backgroundAlpha: bgAlpha,
        });

        SceneManager._app.ticker.add(SceneManager.update);
        window.addEventListener("resize", SceneManager.resize);
    }

    public static changeScene(newScene: IScene): void {
        if (SceneManager._currentScene) {
            SceneManager._app.stage.removeChild(SceneManager._currentScene);
            SceneManager._currentScene.destroy();
        }

        // Add the new one
        SceneManager._currentScene = newScene;
        SceneManager._app.stage.addChild(SceneManager._currentScene);
    }

    // This update will be called by a pixi ticker and tell the scene that a tick happened
    private static update(framesPassed: number): void {
        if (SceneManager._currentScene) {
            SceneManager._currentScene.update(framesPassed);
        }
    }

    public static resize(): void {
        // if we have a scene, we let it know that a resize happened!
        if (SceneManager._currentScene) {
            SceneManager._currentScene.resize(SceneManager.width, SceneManager.height);
        }
    }
}

export interface IScene extends DisplayObject {
    update(framesPassed: number): void;
    // we added the resize method to the interface
    resize(screenWidth: number, screenHeight: number): void;
}
