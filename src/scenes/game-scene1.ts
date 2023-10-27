import { AnimatedSprite, Assets, Container, DisplayObject, FederatedPointerEvent, Graphics, Sprite, Text, Texture } from 'pixi.js';
import { sound } from "@pixi/sound";
import { gsap } from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";
import { IScene, SceneManager } from '../shared/scene-manager';
import { ConfigFragment, FragmentData, StoryScene } from '../shared/story-model';
import { GameScene2 } from './game-scene2';
import { ScenesConfig } from '../config/scenesConfig';

gsap.registerPlugin(PixiPlugin);

PixiPlugin.registerPIXI({
    DisplayObject: DisplayObject,
});

export class GameScene1 extends Container implements IScene {
    innerEar: Sprite;
    storyButton!: Graphics;
    sceneData!: StoryScene;
    fragData!: FragmentData;
    fragText!: Text;
    configFragment!: ConfigFragment;
    allVisited = false;
    visitedFragments: number[] = [];
    hideTextButton!: Graphics;

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
        this.createHideTextButton(parentWidth, parentHeight);
        this.addInnerEar(parentWidth, parentHeight);
        this.addMint(parentWidth, parentHeight);
        this.addPurrl(parentWidth, parentHeight);
        // rotate - just TESTING
        this.rotate(this.innerEar);
        console.log('visitedFragments', this.visitedFragments);
    }

    addSceneData() {
        console.log('scene number', this.sceneData.scene);

        this.sceneData.fragments.forEach((fragment: FragmentData, i) => {
            // console.log(`${i}: ${fragment.id} - ${fragment.text}`);

            const offsetX = 50 + i*50;
            const offsetY = 100 + i*120;
            const animation = this.assignAnimation(i);
            // console.log('animation for index', i, animation);
            const fragmentText = new Text(fragment.text, ScenesConfig.fragmentStyle);

            fragmentText.position.set(offsetX, offsetY);
            fragmentText.alpha = 0;

            this.addChild(fragmentText);

            this.storyButton = new Graphics()
                .beginFill('hsl(204 30% 70% / 0.4)')
                .drawCircle(0, 0, 40);
            this.storyButton.eventMode = 'static';
            this.storyButton.cursor = 'pointer';
            this.storyButton.on('pointerdown', () => {
                console.log('storyButton activates fragment index', i, 'id', fragment.id);
                this.activateFragment(fragment, fragmentText, animation);
                this.updateVisitedFragments(fragment, i);
            });

            this.addStoryButton(offsetX, offsetY);
        });
    }

    assignAnimation(i: number) {
        switch (i) {
            case 0:
                return this.mint;
            case 1:
                return this.purrl;
        }
    }

    addStoryButton(offsetX: number, offsetY: number) {
        this.storyButton.position.set(offsetX-40, offsetY);
        this.addChild(this.storyButton);
    }

    activateFragment(fragment: FragmentData, fragText: Text, animation: any) {
        gsap.to(fragText, {
            pixi: { alpha: 1 },
            duration: 1,
        });
        if (fragment.sounds) {
            fragment.sounds.forEach(s => sound.play(s));
        }
        if (animation) {
            gsap.to(animation, {
                pixi: { alpha: 1 },
                duration: 2,
            });
            animation.play();
        }
        console.log('visited', fragment.id);
        this.hideText(fragment, fragText);
    }

    hideText(fragment: FragmentData, fragText: Text) {
        console.log('will hide fragText id', fragment.id, fragText);

        this.hideTextButton.on('pointerdown', (e) => {
            if (e.target === this.hideTextButton) {
                console.log('bgListnerObj pointer down event target is bgListenerObj', e.target);
                console.log('now hideText', fragment.id, fragText);
                gsap.to(fragText, {
                    pixi: { alpha: 0 },
                    duration: 1,
                });
            }
        });
        this.addChild(this.hideTextButton);
    }


    createHideTextButton(parentWidth: number, parentHeight: number) {
        this.hideTextButton = new Graphics()
            .beginFill(0x000000)
            .drawRect(0, 0, parentWidth, parentHeight);
        this.hideTextButton.position.set(0, 0);
        this.hideTextButton.eventMode = 'static';
        this.hideTextButton.alpha = 0.1;

        // this.hideTextButton.on('pointerdown', (e) => {
        //     if (e.target === this.hideTextButton) {
        //         console.log('bgListnerObj pointer down event target is bgListenerObj', e.target);
        //     }
        // });
        // this.addChild(this.hideTextButton);
    }

    addMint(parentWidth: number, parentHeight: number) {
        this.mint.anchor.set(0.5);
        this.mint.position.x = parentWidth * 0.75;
        this.mint.position.y = parentHeight * 0.75;
        this.mint.loop = true;
        this.mint.animationSpeed = 0.2;
        this.mint.alpha = 0;
        this.addChild(this.mint);
    }

    addPurrl(parentWidth: number, parentHeight: number) {
        this.purrl.anchor.set(0.5);
        this.purrl.position.x = parentWidth * 0.25;
        this.purrl.position.y = parentHeight * 0.75;
        this.purrl.loop = true;
        this.purrl.animationSpeed = 0.2;
        this.purrl.alpha = 0;
        this.addChild(this.purrl);
    }

    addInnerEar(parentWidth: number, parentHeight: number) {
        this.innerEar.anchor.set(0.5);
        // size of innerEar.png is 695x511 therefore its aspect ratio is 0.735:1
        this.innerEar.width = Math.min(parentWidth*0.8, 1389);
        this.innerEar.height = Math.min(parentWidth*0.8, 1389) * 0.735;
        this.innerEar.position.x = parentWidth*0.5;
        this.innerEar.position.y = parentHeight*0.5;
        this.innerEar.alpha = 0.5;

        // this.innerEar.eventMode = 'static';
        // this.innerEar.cursor = 'pointer';

        // this.innerEar.on('pointerdown', () => {
        //     this.goToNextScene();
        // });
        this.addChild(this.innerEar);
    }

    updateVisitedFragments(fragment: FragmentData, index: number) {
        console.log('called updateVisitedFragments', index, fragment.id);
        if (!this.visitedFragments.includes(index)) {
            this.visitedFragments.push(index);
            console.log('visitedFragments', this.visitedFragments);
            if (this.visitedFragments.length === this.sceneData.fragments.length) {
                this.allVisited = true;
                console.log('allVisited', this.allVisited);
                this.goToNextScene();
            }
        }
    }

    goToNextScene() {
        // TODO: remove any event listeners & kill any animations
        // TODO: setTimeout is a TEMPORARY hack
        setTimeout(() => {
            SceneManager.changeScene(new GameScene2(SceneManager.width, SceneManager.height));
        }, 3000);
    }

    // TODO: remove, JUST TESTING
    rotate(sprite: Sprite) {
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
