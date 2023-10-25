import { Assets, Container, DisplayObject, Sprite, Text } from 'pixi.js';
import { sound } from "@pixi/sound";
import { gsap } from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";
import { IScene, SceneManager } from '../shared/scene-manager';
import { ConfigFragment, Fragment, StoryScene } from '../shared/story-model';
import { GameScene2 } from './game-scene2';
import { StoryButton } from '../components/story-button';

gsap.registerPlugin(PixiPlugin);

PixiPlugin.registerPIXI({
    DisplayObject: DisplayObject,
});

export class GameScene1 extends Container implements IScene {
    innerEar: Sprite;
    storyButton!: StoryButton;
    sceneData!: StoryScene;
    fragment!: Fragment;
    fragText!: Text;
    configFragment!: ConfigFragment;

    constructor(parentWidth: number, parentHeight: number) {
        super();
        //initialize content
        this.innerEar = Sprite.from("innerEar");

        Assets.load('assets/tailspinScenes.json').then((data) => {
            this.sceneData = data[0]; // scene 1
            this.init(parentWidth, parentHeight);
        });
    }

    init(parentWidth: number, parentHeight: number) {
        this.addSceneData();
        this.addInnerEar(parentWidth, parentHeight);

        this.configFragment = {
            id: this.fragment.id,
            fragText: this.fragText,
            sprite: this.innerEar,
        }

        this.storyButton = new StoryButton(this.configFragment, this.activateFragment);
        this.addStoryButton(parentWidth, parentHeight);

        this.rotate(this.innerEar);
    }

    addSceneData() {
        console.log('scene', this.sceneData.scene);
        this.sceneData.fragments.forEach((fragment: Fragment) => {
            console.log(`${fragment.id} - ${fragment.text}`);
        });

        this.fragment = this.sceneData.fragments[0];
        this.fragText = new Text(this.fragment.text);
        this.fragText.position.set(50, 100);
        this.fragText.alpha = 0;
        this.addChild(this.fragText);
    }

    addStoryButton(parentWidth: number, parentHeight: number) {
        this.storyButton.position.set(parentWidth*0.75, parentHeight*0.2);
        this.addChild(this.storyButton);
    }

    activateFragment(config: ConfigFragment) {
        console.log('activate fragText id:', config.id, '-', config.fragText.text);
        gsap.to(config.sprite, {
            pixi: { rotation: '+= 180' },
            duration: 1
        });
        gsap.to(config.fragText, {
            pixi: { alpha: 1 },
            duration: 1,
        });
    }

    addInnerEar(parentWidth: number, parentHeight: number) {
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

    rotate(sprite: Sprite) {
        // console.log('rotate');
        gsap.to(sprite, {
            pixi: { rotation: '+= 360' },
            duration: 2
        });
    }

    update(framesPassed: number) {
        // console.log('update framesPassed: ', framesPassed);
    }

    resize(parentWidth: number, parentHeight: number) {
        // TODO: why doesn't this resize anything?

        this.innerEar.position.x = parentWidth*0.5;
        this.innerEar.position.y = parentHeight*0.5;
    }
}
