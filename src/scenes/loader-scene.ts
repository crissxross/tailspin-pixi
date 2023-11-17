import { Container, Assets, utils, Graphics, DisplayObject } from 'pixi.js'
// import { LoadingBarContainer } from '../containers/loading-bar-container';
import { SceneManager, IScene } from '../shared/scene-manager';
import { gsap } from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";
import { manifest } from '../config/manifest';
import { Scene1 } from './scene1';
// next scene
import { Scene2 } from './scene2';

gsap.registerPlugin(PixiPlugin);

PixiPlugin.registerPIXI({
    DisplayObject: DisplayObject,
});

// TODO: commented out _loadingBar stuff because it's buggy. Using a simple CSS loading spinner instead

export class LoaderScene extends Container implements IScene {
    // private _loadingBar: LoadingBarContainer;
    startButton!: Graphics;

    constructor() {
        super();

        console.log('texture cache:', utils.TextureCache)

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
        // console.log('download progress', progressRatio);
        // this._loadingBar.scaleProgress(progressRatio);
    }

    private loaded(): void {
        gsap.to('.loader', {duration: 0.3, autoAlpha: 0, ease: "power2.out"});
        this.addStartButton();
        // SceneManager.changeScene(new Scene1(SceneManager.width, SceneManager.height, 0, Scene2));
    }

    // TODO: turn this into a button container so that I can add text to it
    addStartButton(): void {
        this.startButton = new Graphics()
            .beginFill('hsl(204 30% 70% / 0.6)')
            .drawRoundedRect(0, 0, 200, 100, 30)
            .endFill();
        this.startButton.position.set(SceneManager.width * 0.5 - 100, SceneManager.height * 0.75 - 50);
        this.startButton.eventMode = 'static';
        this.startButton.cursor = 'pointer';
        this.startButton.on('pointerdown', () => {
            this.fadeOutTitleView();
        });
        this.addChild(this.startButton);
    }

    fadeOutTitleView(): void {
        const tl = gsap.timeline({onComplete: this.goToFirstScene.bind(this)});
        tl.to('.game-title', {
            autoAlpha: 0,
            duration: 1,
            ease: "power2.out"
        });
        tl.to(this.startButton, {
            pixi: { alpha: 0 },
            duration: 0.3,
            ease: "power2.out"
        }, '<');
    }

    goToFirstScene(): void {
        SceneManager.changeScene(new Scene1(SceneManager.width, SceneManager.height, 0, Scene2));
        this.removeStuff();
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
