import { AnimatedSprite, Assets, Container, DisplayObject, Graphics, Sprite, Text, Texture } from 'pixi.js';
import { sound } from "@pixi/sound";
import { gsap } from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";
import { IScene, SceneManager } from '../shared/scene-manager';
import { FragmentData, StoryScene } from '../shared/story-model';
import { GameScene2 } from './game-scene2';
import { ScenesConfig } from '../config/scenesConfig';

gsap.registerPlugin(PixiPlugin);

PixiPlugin.registerPIXI({
    DisplayObject: DisplayObject,
});

export class GameScene1 extends Container implements IScene {
    storyButton!: Graphics;
    sceneData!: StoryScene;
    fragData!: FragmentData;
    fragText!: Text;
    animContainer: Container;
    private visitedFragments: number[] = [];
    private allVisited = false;
    private endSceneTimer!: number;
    storyButtonList: Graphics[] = [];

    innerEar: Sprite;
    goldie: AnimatedSprite;
    goldieTextures: Texture[] = [];
    mint: AnimatedSprite;
    mintTextures: Texture[] = [];
    purrl: AnimatedSprite;
    purrlTextures: Texture[] = [];

    constructor(parentWidth: number, parentHeight: number) {
        super();

        this.innerEar = Sprite.from("innerEar");
        this.animContainer = new Container();

        for (let i = 0; i < 6; i++) {
            const texture = Texture.from(`Goldie000${i}`);
            this.goldieTextures.push(texture)
        }
        this.goldie = new AnimatedSprite(this.goldieTextures);

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
        this.addChild(this.animContainer);
        this.addInnerEar(parentWidth, parentHeight);
        this.addSceneData();
        this.addGoldie(parentWidth, parentHeight);
        this.addMint(parentWidth, parentHeight);
        this.addPurrl(parentWidth, parentHeight);
    }

    addSceneData() {
        console.log('scene number', this.sceneData.scene);
        // populate scene with fragments with their corresponding animations & story activation buttons
        this.sceneData.fragments.forEach((fragment: FragmentData, i) => {
            // console.log(`${i}: ${fragment.id} - ${fragment.text}`);
            const animation = this.assignAnimation(fragment.id);
            // console.log('animation for index', i, animation);
            const fragmentText = new Text(fragment.text, ScenesConfig.fragmentStyle);
            fragmentText.position.set(fragment.position[0], fragment.position[1]);
            fragmentText.alpha = 0;

            this.addChild(fragmentText);
            this.addStoryButton(i, fragment, fragmentText, animation);
        });
    }

    addStoryButton(
        index: number, fragment: FragmentData, fragmentText: Text, animation: any
        ) {
        this.storyButton = new Graphics()
            .beginFill('hsl(204 30% 70% / 0.4)')
            .drawCircle(0, 0, 30);
        this.storyButtonList.push(this.storyButton);
        this.storyButton.position.set(fragment.button[0], fragment.button[1]);
        this.storyButton.eventMode = 'static';
        this.storyButton.cursor = 'pointer';
        // ACTIVATE story fragment
        this.storyButton.on('pointerenter', () => {
            // console.log('pointerenter fragment index', i, 'id', fragment.id);
            this.activateFragment(fragment, fragmentText, animation);
            this.updateVisitedFragments(index);
            // Cancel the existing timer (if any)
            clearTimeout(this.endSceneTimer);
        });
        // DEACTIVATE story fragment
        this.storyButton.on('pointerleave', () => {
            // console.log('pointerleave - so hide fragment id', fragment.id);
            this.deactivateFragment(fragment, fragmentText, animation);
            // show story button as visited
            gsap.to(this.storyButtonList[index], {
                pixi: { alpha: 0.6 },
                duration: 0.5,
            });
            if (this.allVisited) {
                this.endScene();
            }
        });
        this.addChild(this.storyButton);
    }

    assignAnimation(fragId: string) {
        switch (fragId) {
            case 'g2':
                return this.goldie;
            case 'j1':
                this.tweenPurrl();
                return this.purrl;
            case 'j2':
                return this.mint;
        }
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
            // play the AnimatedSprite
            animation.play();
        }
        // console.log('visited', fragment.id);
    }

    deactivateFragment(fragment: FragmentData, fragText: Text, animation: any) {
        // console.log('deactivateFragment', fragment.id);
        gsap.to(fragText, {
            pixi: { alpha: 0 },
            duration: 1,
        });
        // TODO: most/all animations have a finite length and should play through to their end so may not need this
        // if (animation) {
        //     animation.stop();
        // }
    }

    addGoldie(parentWidth: number, parentHeight: number) {
        this.goldie.anchor.set(0.5, 1);
        this.goldie.scale.set(0.9);
        this.goldie.position.x = parentWidth * 0.15;
        this.goldie.position.y = parentHeight * 0.94;
        this.goldie.loop = true;
        this.goldie.animationSpeed = 0.2;
        this.goldie.alpha = 0;
        this.animContainer.addChild(this.goldie);
    }

    addMint(parentWidth: number, parentHeight: number) {
        this.mint.anchor.set(0.5, 1);
        this.mint.scale.set(0.9);
        this.mint.position.x = parentWidth * 0.88;
        this.mint.position.y = parentHeight * 0.98;
        this.mint.loop = true;
        this.mint.animationSpeed = 0.2;
        this.mint.alpha = 0;
        this.animContainer.addChild(this.mint);
    }

    addPurrl(parentWidth: number, parentHeight: number) {
        this.purrl.anchor.set(0.5, 1);
        this.purrl.scale.set(0.8);
        this.purrl.position.x = parentWidth * 0.25;
        this.purrl.position.y = parentHeight * 0.94;
        this.purrl.loop = true;
        this.purrl.animationSpeed = 0.2;
        this.purrl.alpha = 0;
        this.animContainer.addChild(this.purrl);
    }

    tweenPurrl() {
        return gsap.to(this.purrl, {
            pixi: { scale: 0.9 },
            x: '+= 100',
            duration: 2,
            ease: 'power1.inOut',
            repeat: -1,
            yoyo: true,
        });
        // this.purrl.play();
    }

    addInnerEar(parentWidth: number, parentHeight: number) {
        // size of innerEar.png is 695x511 therefore its aspect ratio is 0.735:1
        this.innerEar.width = Math.min(parentWidth*0.8, 1389);
        this.innerEar.height = Math.min(parentWidth*0.8, 1389) * 0.735;
        this.innerEar.anchor.set(0.5);
        this.innerEar.position.x = parentWidth*0.5;
        this.innerEar.position.y = parentHeight*0.5;
        this.innerEar.alpha = 0;
        this.addChild(this.innerEar);
        gsap.timeline()
            .to(this.innerEar, {
                pixi: { alpha: 0.4 },
                duration: 3
            })
            .to(this.innerEar, {
                pixi: { alpha: 0 },
                duration: 5
            }, '>1');
    }

    updateVisitedFragments(index: number) {
        if (!this.visitedFragments.includes(index)) {
            this.visitedFragments.push(index);
            console.log('visitedFragments', this.visitedFragments);
            if (this.visitedFragments.length === this.sceneData.fragments.length) {
                this.allVisited = true;
                console.log('allVisited', this.allVisited);
            }
        }
    }

    endScene() {
        // Cancel the existing timer (if any) and create a new one
        clearTimeout(this.endSceneTimer);
        this.endSceneTimer = setTimeout(() => {
            gsap.timeline({onComplete: this.goToNextScene})
                .to(this.animContainer, {
                    pixi: { alpha: 0 },
                    duration: 1.5,
                });
        }, 2000);
    }

    goToNextScene() {
        // TODO: remove any event listeners, kill any animations & fade out & stop any sounds
        SceneManager.changeScene(new GameScene2(SceneManager.width, SceneManager.height));
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
