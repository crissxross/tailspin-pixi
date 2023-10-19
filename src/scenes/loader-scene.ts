import { Container, Assets } from 'pixi.js'
// import { LoadingBarContainer } from '../containers/loading-bar-container';
import { SceneManager, IScene } from '../shared/scene-manager';
import { GameScene1 } from './game-scene1';
import { manifest } from '../shared/manifest';
import { gsap } from "gsap";

// TODO: commented out _loadingBar stuff because it's buggy. Using a simple CSS loading spinner instead

export class LoaderScene extends Container implements IScene {
    // private _loadingBar: LoadingBarContainer;

    constructor() {
        super();

        // const loaderBarWidth = 280;
        // this._loadingBar = new LoadingBarContainer(loaderBarWidth, SceneManager.width, SceneManager.height);

        // this.addChild(this._loadingBar);
        this.initLoader().then(() => {
            this.loaded();
        });
    }

    async initLoader(): Promise<void> {
        await Assets.init({manifest: manifest});
        const bundlesIds = manifest.bundles.map(bundle => bundle.name);
        await Assets.loadBundle(bundlesIds, this.downloadProgress.bind(this));
        // await Assets.loadBundle(bundlesIds);
    }

    private downloadProgress(progressRatio: number): void {
        console.log('download progress', progressRatio);
        // this._loadingBar.scaleProgress(progressRatio);
    }

    private loaded(): void {
        SceneManager.changeScene(new GameScene1(SceneManager.width, SceneManager.height));

        const tl = gsap.timeline({onComplete: this.removeStuff});
        tl.to('.game-title', {duration: 1, autoAlpha: 0, ease: "power2.out"});
        tl.to('.loader', {duration: 0.3, autoAlpha: 0, ease: "power2.out"}, "<");
    }

    removeStuff(): void {
        const title = document.querySelector('.game-title');
        const spinner = document.querySelector('.loader');
        if (title) title.remove();
        if (spinner) spinner.remove();
    }

    update(framesPassed: number): void {
        //...
    }

    resize(parentWidth: number, parentHeight: number): void {
        //...
    }
}
