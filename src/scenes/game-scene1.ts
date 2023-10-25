import { AnimatedSprite, Assets, Container, DisplayObject, Sprite, Text, Texture } from 'pixi.js';
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

        this.configFragment = {
            id: this.fragment.id,
            fragText: this.fragText,
            sprite: this.innerEar,
            animatedSprites: [this.mint, this.purrl],
            sounds: ["tinkling-chimes"]
        }

        this.storyButton = new StoryButton(this.configFragment, this.activateFragment);
        this.addStoryButton(parentWidth, parentHeight);

        this.addMint(parentWidth, parentHeight);
        this.addPurrl(parentWidth, parentHeight);

        this.rotate(this.innerEar);
    }

    addSceneData() {
        console.log('scene', this.sceneData.scene);
        this.sceneData.fragments.forEach((fragment: Fragment) => {
            // console.log(`${fragment.id} - ${fragment.text}`);
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
        if (config.sprite) {
            gsap.to(config.sprite, {
                pixi: { rotation: '+= 180' },
                duration: 1
            });
        }
        if (config.animatedSprites) {
            gsap.to(config.animatedSprites, {
                pixi: { alpha: 1 },
                duration: 2,
                stagger: 0.5,
            });
            config.animatedSprites.forEach(sprite => sprite.play());
        }
        if (config.sounds) {
            config.sounds.forEach(s => sound.play(s));
        }
        console.log('activate fragText id:', config.id, '-', config.fragText.text);
        gsap.to(config.fragText, {
            pixi: { alpha: 1 },
            duration: 1,
        });
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
