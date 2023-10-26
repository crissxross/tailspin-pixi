import { AnimatedSprite, Assets, Container, DisplayObject, Sprite, Text, Texture } from 'pixi.js';
import { sound } from "@pixi/sound";
import { gsap } from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";
import { IScene, SceneManager } from '../shared/scene-manager';
import { ConfigFragment, FragmentData, StoryScene } from '../shared/story-model';
import { GameScene2 } from './game-scene2';
import { StoryButton } from '../components/story-button';
import { ScenesConfig } from '../config/scenesConfig';

gsap.registerPlugin(PixiPlugin);

PixiPlugin.registerPIXI({
    DisplayObject: DisplayObject,
});

export class GameScene1 extends Container implements IScene {
    innerEar: Sprite;
    storyButton!: StoryButton;
    sceneData!: StoryScene;
    fragData!: FragmentData;
    fragText!: Text;
    configFragment!: ConfigFragment;
    mint: AnimatedSprite;
    mintTextures: Texture[] = [];
    purrl: AnimatedSprite;
    purrlTextures: Texture[] = [];

    constructor(parentWidth: number, parentHeight: number) {
        super();

        this.innerEar = Sprite.from("innerEar");

        for (let i = 0; i < 6; i++) {
            const texture = Texture.from(`Mint000${i}`);
            this.mintTextures.push(texture)
        }
        this.mint = new AnimatedSprite(this.mintTextures);

        for (let i = 0; i < 6; i++) {
            const texture = Texture.from(`Purrl000${i}`);
            this.purrlTextures.push(texture)
        }
        this.purrl = new AnimatedSprite(this.purrlTextures);

        Assets.load('assets/tailspinScenes.json').then((data) => {
            this.sceneData = data[0]; // scene 1
            this.init(parentWidth, parentHeight);
        });
    }

    init(parentWidth: number, parentHeight: number) {
        this.addSceneData();
        this.addInnerEar(parentWidth, parentHeight);
        this.addMint(parentWidth, parentHeight);
        this.addPurrl(parentWidth, parentHeight);
        // rotate - just TESTING
        this.rotate(this.innerEar);
    }

    addSceneData() {
        console.log('scene number', this.sceneData.scene);

        this.sceneData.fragments.forEach((fragment: FragmentData, i) => {
            console.log(`${i}: ${fragment.id} - ${fragment.text}`);

            const offsetX = 50 + i*50;
            const offsetY = 100 + i*120;
            const animation = this.assignAnimation(i);
            console.log('animation for index', i, animation);

            this.fragData = this.sceneData.fragments[i];

            this.fragText = new Text(this.fragData.text, ScenesConfig.fragmentStyle);

            this.fragText.position.set(offsetX, offsetY);
            this.fragText.alpha = 0;

            this.configFragment = {
                index: i,
                id: this.fragData.id,
                fragText: this.fragText,
                sounds: this.fragData.sounds,
                sprite: this.innerEar,
                animation: animation,
                // animatedSprites: [mint, purrl],
            }

            this.addChild(this.fragText);

            this.storyButton = new StoryButton(this.configFragment, this.activateFragment);
            this.addStoryButton(offsetX, offsetY);
        });
    }

    assignAnimation(i: number) {
        switch (i) {
            case 0:
                return this.mint;
            case 1:
                return this.purrl;
            // case 2:
            //     return this.animation3;
            // default:
            //     this.defaultAnimation;
        }
    }

    addStoryButton(offsetX: number, offsetY: number) {
        this.storyButton.position.set(offsetX-40, offsetY);
        this.addChild(this.storyButton);
    }

    activateFragment(config: ConfigFragment) {
        gsap.to(config.fragText, {
            pixi: { alpha: 1 },
            duration: 1,
        });
        if (config.sounds) {
            config.sounds.forEach(s => sound.play(s));
        }
        if (config.animation) {
            gsap.to(config.animation, {
                pixi: { alpha: 1 },
                duration: 2,
                stagger: 0.5,
            });
            config.animation.play();
        }
        // if (config.animatedSprites) {
            //     gsap.to(config.animatedSprites, {
                //         pixi: { alpha: 1 },
                //         duration: 2,
                //         stagger: 0.5,
                //     });
                //     config.animatedSprites.forEach(sprite => sprite.play());
                // }
        if (config.sprite) {
            gsap.to(config.sprite, {
                pixi: { rotation: '+= 180' },
                duration: 1
            });
        }
        console.log(`activate fragText ${config.index}: ${config.id} - ${config.fragText.text}`);
    }

    addMint(parentWidth: number, parentHeight: number) {
        this.mint.anchor.set(0.5);
        this.mint.position.x = parentWidth * 0.75;
        this.mint.position.y = parentHeight * 0.75;
        this.mint.loop = true;
        this.mint.animationSpeed = 0.2;
        this.mint.alpha = 0;
        this.addChild(this.mint);
        // this.mint.play();
    }

    addPurrl(parentWidth: number, parentHeight: number) {
        this.purrl.anchor.set(0.5);
        this.purrl.position.x = parentWidth * 0.25;
        this.purrl.position.y = parentHeight * 0.75;
        this.purrl.loop = true;
        this.purrl.animationSpeed = 0.2;
        this.purrl.alpha = 0;
        this.addChild(this.purrl);
        // this.purrl.play();
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
            SceneManager.changeScene(new GameScene2(SceneManager.width, SceneManager.height));
            // sound.play("tinkling-chimes");
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
