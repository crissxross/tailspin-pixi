import { Container, DisplayObject, Sprite } from 'pixi.js';
import { sound } from "@pixi/sound";
import { IScene, SceneManager } from '../shared/scene-manager';
import { GameScene2 } from './game-scene2';
import { gsap } from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";

gsap.registerPlugin(PixiPlugin);

PixiPlugin.registerPIXI({
    DisplayObject: DisplayObject,
});

export class GameScene1 extends Container implements IScene {
    sky: Sprite;
    pixiLogo: Sprite;

    constructor(parentWidth: number, parentHeight: number) {
        super();

        //you can remove all of this code
        //initialize sprites
        this.sky = Sprite.from("sky");
        this.sky.anchor.set(0.5);
        this.sky.width = parentWidth;
        this.sky.height = parentHeight;
        this.sky.position.x = parentWidth * 0.5;
        this.sky.position.y = parentHeight * 0.5;
        this.sky.alpha = 0;

        this.pixiLogo = Sprite.from("pixiLogo");
        this.pixiLogo.anchor.set(0.5);
        // size of logo is 734x288 therefore its aspect ratio is 1:0.39
        this.pixiLogo.width = Math.min(parentWidth * 0.6, 734);
        this.pixiLogo.height = Math.min(parentWidth * 0.6, 734) * 0.39;
        this.pixiLogo.position.x = parentWidth * 0.5;
        this.pixiLogo.position.y = parentHeight * 0.5;

        this.pixiLogo.eventMode = 'static';
        this.pixiLogo.cursor = 'pointer';

        this.pixiLogo.on('pointerdown', () => {
            sound.play("tinkling-chimes");
            // console.log('clicked');
            SceneManager.changeScene(new GameScene2(SceneManager.width, SceneManager.height));
        });

        this.addChild(this.sky, this.pixiLogo);

        this.animate();
    }

    animate(): void {
        gsap.to(this.pixiLogo, {
            pixi: { rotation: 360 },
            duration: 2
        });

        gsap.to(this.sky, {
            pixi: { alpha: 1 },
            duration: 4, delay: 2
        });
    }

    update(framesPassed: number): void {
        // console.log('update framesPassed: ', framesPassed);
    }

    resize(parentWidth: number, parentHeight: number): void {
        // TODO: why doesn't this resize anything?

        this.sky.width = parentWidth;
        this.sky.height = parentHeight;

        this.pixiLogo.position.x = parentWidth * 0.5;
        this.pixiLogo.position.y = parentHeight * 0.5;
    }
}
