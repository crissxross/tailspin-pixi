import { AnimatedSprite, Assets, Container, Graphics, Sprite, Text, Texture } from 'pixi.js';
import { sound } from "@pixi/sound";
import { gsap } from "gsap";
// import { PixiPlugin } from "gsap/PixiPlugin";
import { IScene, SceneManager } from '../shared/scene-manager';
import { StoryScene, FragmentData } from '../shared/story-model';
import { addSceneData, createStoryButton, checkAllVisited, uiNext, uiPrevious } from '../shared/scene-utils.ts';
// next & previous scenes
import { GameSceneDemo } from './game-scene-demo';
import { GameScene1 } from './game-scene1';

export class GameScene2 extends Container implements IScene {
    storyButton!: Graphics;
    sceneData!: StoryScene;
    fragData!: FragmentData;
    buttonsContainer: Container;
    animContainer: Container;
    visitedFragments: number[] = [];
    allVisited = false;
    endSceneTimer!: number;
    storyButtonList: Graphics[] = [];
    nextScene = GameSceneDemo;
    previousScene = GameScene1;

    // specific to this scene
    sky: Sprite;
    mint: AnimatedSprite;
    mintTextures: Texture[] = [];
    butch: AnimatedSprite;
    butchTextures: Texture[] = [];
    explosion: AnimatedSprite;
    explosionTextures: Texture[] = [];

    constructor(parentWidth: number, parentHeight: number) {
        super();

        this.buttonsContainer = new Container();
        this.animContainer = new Container();

        // initialize/load content
        this.sky = Sprite.from("sky");

        for (let i = 0; i < 6; i++) {
            const texture = Texture.from(`Mint000${i}`);
            this.mintTextures.push(texture)
        }
        this.mint = new AnimatedSprite(this.mintTextures);

        for (let i = 0; i < 6; i++) {
            const texture = Texture.from(`Butch000${i}`);
            this.butchTextures.push(texture)
        }
        this.butch = new AnimatedSprite(this.butchTextures);

        for (let i = 1; i < 28; i++) {
            const texture = Texture.from(`Explosion_Sequence_A ${i}.png`);
            this.explosionTextures.push(texture)
        }
        this.explosion = new AnimatedSprite(this.explosionTextures);

        Assets.load('assets/tailspinScenes.json').then((data) => {
            this.sceneData = data[1]; // scene 2
            this.init(parentWidth, parentHeight);
        });
    }

    init(parentWidth: number, parentHeight: number) {
        this.addChild(this.buttonsContainer);
        this.addChild(this.animContainer);
        addSceneData(
            this.sceneData,
            this.addChild.bind(this),
            this.addStoryButton.bind(this),
            this.assignAnimation.bind(this),
        );
        uiNext(this.nextScene, parentWidth, parentHeight, this.addChild.bind(this));
        uiPrevious(this.previousScene, parentHeight, this.addChild.bind(this));

        // this.addSky(parentWidth, parentHeight);
        this.addExplosion(parentWidth, parentHeight);
        this.addMint(parentWidth, parentHeight);
        this.addButch(parentWidth, parentHeight);
    }

    addStoryButton(
        index: number, fragment: FragmentData, fragmentText: Text, animation: any
    ) {
        const btn = createStoryButton(
            this.storyButtonList,
            this.activateFragment.bind(this),
            this.deactivateFragment.bind(this),
            this.updateVisitedFragments.bind(this),
            index,
            fragment,
            fragmentText,
            animation,
        );
        this.buttonsContainer.addChild(btn);
        btn.on('pointerenter', () => {
            // Cancel the existing timer (if any)
            clearTimeout(this.endSceneTimer);
        });
        btn.on('pointerleave', () => {
            if (this.allVisited) {
                this.endScene();
            }
        });
    }

    assignAnimation(fragId: string) {
        switch (fragId) {
            case 'j6':
                return this.mint;
            case 'g8':
                // NOTE: not in orginal scene
                return this.explosion;
            case 'g6':
                return this.butch;
            // case 'j1':
                // this.tweenPurrl();
                // return this.purrl;
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

    updateVisitedFragments(index: number) {
        if (checkAllVisited(this.visitedFragments, index, this.sceneData)) {
            this.allVisited = true;
            console.log('allVisited', this.allVisited);
        }
    }

    endScene() {
        // Cancel the existing timer (if any) & create a new one
        clearTimeout(this.endSceneTimer);
        this.endSceneTimer = setTimeout(() => {
            gsap.timeline({onComplete: this.goToNextScene})
                .to([this.animContainer, this.buttonsContainer], {
                    pixi: { alpha: 0 },
                    duration: 1.5,
                });
        }, 2000);
    }

    goToNextScene() {
        // TODO: remove any event listeners, kill any animations & fade out & stop any sounds
        SceneManager.changeScene(new GameSceneDemo(SceneManager.width, SceneManager.height));
    }

    // SPECIFIC TO THIS SCENE -----------------------------

    addMint(parentWidth: number, parentHeight: number) {
        this.mint.anchor.set(0.5);
        this.mint.position.x = parentWidth * 0.6;
        this.mint.position.y = parentHeight - this.mint.height * 0.5;
        this.mint.loop = true;
        this.mint.animationSpeed = 0.2;
        this.mint.alpha = 0;
        this.animContainer.addChild(this.mint);
    }

    addButch(parentWidth: number, parentHeight: number) {
        this.butch.anchor.set(0.5);
        this.butch.position.x = parentWidth - this.butch.width * 0.5 - 20;
        this.butch.position.y = parentHeight * 0.5;
        this.butch.loop = true;
        this.butch.animationSpeed = 0.2;
        this.butch.alpha = 0;
        this.animContainer.addChild(this.butch);
    }

    addSky(parentWidth: number, parentHeight: number) {
        this.sky.anchor.set(0.5);
        this.sky.width = parentWidth;
        this.sky.height = parentHeight;
        this.sky.position.x = parentWidth * 0.5;
        this.sky.position.y = parentHeight * 0.5;
        this.sky.alpha = 0;
        this.addChild(this.sky);
        gsap.to(this.sky, {
            pixi: { alpha: 1 },
            duration: 1,
        });
    }

    addExplosion(parentWidth: number, parentHeight: number) {
        this.explosion.anchor.set(0.5);
        this.explosion.position.x = parentWidth * 0.78;
        this.explosion.position.y = parentHeight * 0.85;
        this.explosion.loop = false;
        this.explosion.animationSpeed = 0.3;
        this.explosion.alpha = 0;
        this.animContainer.addChild(this.explosion);
    }

    // TODO: methods below from template - do I need them in this app?
    update(framesPassed: number) {
        // console.log('update framesPassed: ', framesPassed);
    }

    resize(parentWidth: number, parentHeight: number) {
        // TODO: why doesn't this resize anything?

        this.sky.width = parentWidth;
        this.sky.height = parentHeight;

    }
}
