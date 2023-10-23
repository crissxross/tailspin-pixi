import { Container, DisplayObject, Graphics, Sprite } from 'pixi.js';
import { sound } from "@pixi/sound";
import { ButtonContainer } from "@pixi/ui";
import { gsap } from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";
import { IScene, SceneManager } from '../shared/scene-manager';
import { GameScene2 } from './game-scene2';
import { StoryButton } from '../components/story-button';


gsap.registerPlugin(PixiPlugin);

PixiPlugin.registerPIXI({
    DisplayObject: DisplayObject,
});

export class GameScene1 extends Container implements IScene {
    sky: Sprite;
    innerEar: Sprite;
    testButton: ButtonContainer;
    storyButton: StoryButton;

    constructor(parentWidth: number, parentHeight: number) {
        super();
        //initialize sprites
        this.innerEar = Sprite.from("innerEar");
        this.sky = Sprite.from("sky");
        // add sprites & content, etc.
        this.addInnerEar(parentWidth, parentHeight);
        // TODO: do I need sky in this scene?
        // this.addSky(parentWidth, parentHeight);

        this.rotate(this.innerEar);

        this.storyButton = new StoryButton('story1', this.innerEar, this.activateStory);
        this.storyButton.position.set(parentWidth*0.75, parentHeight*0.2);
        this.addChild(this.storyButton);


        this.testButton = new ButtonContainer(
            new Graphics()
                .beginFill('hsl(20 40% 80% / 0.5)')
                .drawCircle(0, 0, 40)
        );
        this.testButton.position.set(parentWidth*0.25, parentHeight*0.2);
        this.addChild(this.testButton);
        this.testButton.onPress.connect(() => {
            this.rotate(this.innerEar);
            console.log('onPress');
        });

    }

    activateStory(fragment: String, sprite: Sprite): void {
        console.log('activateStory', fragment);
        gsap.to(sprite, {
            pixi: { rotation: '+= 180' },
            duration: 1
        });
    }

    addInnerEar(parentWidth: number, parentHeight: number): void {
        this.innerEar.anchor.set(0.5);
        // size of innerEar.png is 695x511 therefore its aspect ratio is 0.735:1
        this.innerEar.width = Math.min(parentWidth*0.8, 1389);
        this.innerEar.height = Math.min(parentWidth*0.8, 1389) * 0.735;
        this.innerEar.position.x = parentWidth*0.5;
        this.innerEar.position.y = parentHeight*0.5;
        this.innerEar.alpha = 0.5;

        this.innerEar.eventMode = 'static';
        this.innerEar.cursor = 'pointer';

        this.innerEar.on('pointerdown', () => {
            sound.play("tinkling-chimes");
            SceneManager.changeScene(new GameScene2(SceneManager.width, SceneManager.height));
        });

        this.addChild(this.innerEar);
    }

    addSky(parentWidth: number, parentHeight: number): void {
        this.sky.anchor.set(0.5);
        this.sky.width = parentWidth;
        this.sky.height = parentHeight;
        this.sky.position.x = parentWidth*0.5;
        this.sky.position.y = parentHeight*0.5;
        this.sky.alpha = 0;
        this.addChild(this.sky);
    }

    rotate(sprite: Sprite) {
        console.log('rotate');
        gsap.to(sprite, {
            pixi: { rotation: '+= 360' },
            duration: 2
        });
    }

    update(framesPassed: number): void {
        // console.log('update framesPassed: ', framesPassed);
    }

    resize(parentWidth: number, parentHeight: number): void {
        // TODO: why doesn't this resize anything?

        this.sky.width = parentWidth;
        this.sky.height = parentHeight;

        this.innerEar.position.x = parentWidth*0.5;
        this.innerEar.position.y = parentHeight*0.5;
    }
}
