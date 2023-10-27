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
    innerEar: Sprite;
    storyButton!: Graphics;
    sceneData!: StoryScene;
    fragData!: FragmentData;
    fragText!: Text;
    // storyIsActive = false;
    visitedFragments: number[] = [];
    allVisited = false;
    private endSceneTimer!: number;

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
        // populate scene with fragments with their corresponding animations & story activation buttons
        this.sceneData.fragments.forEach((fragment: FragmentData, i) => {
            // console.log(`${i}: ${fragment.id} - ${fragment.text}`);
            const offsetX = 50 + i*50;
            const offsetY = 200 + i*120;
            const animation = this.assignAnimation(i);
            // console.log('animation for index', i, animation);
            const fragmentText = new Text(fragment.text, ScenesConfig.fragmentStyle);
            fragmentText.anchor.set(0, 1);
            fragmentText.position.set(offsetX+40, offsetY);
            fragmentText.alpha = 0;

            this.addChild(fragmentText);
            this.addStoryButton(i, fragment, fragmentText, animation, offsetX, offsetY);
        });
    }

    addStoryButton(
        i: number, fragment: FragmentData, fragmentText: Text, animation: any, offsetX: number, offsetY: number
        ) {
        this.storyButton = new Graphics()
            .beginFill('hsl(204 30% 70% / 0.4)')
            .drawCircle(0, 0, 40);
        this.storyButton.position.set(offsetX, offsetY);
        this.storyButton.eventMode = 'static';
        this.storyButton.cursor = 'pointer';
        // Activate story fragment
        this.storyButton.on('pointerenter', () => {
            console.log('pointerenter fragment index', i, 'id', fragment.id);
            this.activateFragment(fragment, fragmentText, animation);
            this.updateVisitedFragments(fragment, i);
            // Cancel the existing timer (if any)
            clearTimeout(this.endSceneTimer);
        });
        // Deactivate story fragment
        this.storyButton.on('pointerleave', () => {
            console.log('pointerleave - so hide fragment id', fragment.id);
            this.deactivateFragment(fragment, fragmentText, animation);
            if (this.allVisited) {
                this.goToNextScene();
            }
        });
        this.addChild(this.storyButton);
    }

    assignAnimation(i: number) {
        switch (i) {
            case 0:
                return this.mint;
            case 1:
                return this.purrl;
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
        // size of innerEar.png is 695x511 therefore its aspect ratio is 0.735:1
        this.innerEar.width = Math.min(parentWidth*0.8, 1389);
        this.innerEar.height = Math.min(parentWidth*0.8, 1389) * 0.735;
        this.innerEar.anchor.set(0.5);
        this.innerEar.position.x = parentWidth*0.5;
        this.innerEar.position.y = parentHeight*0.5;
        this.innerEar.alpha = 0.5;
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
            }
        }
    }

    goToNextScene() {
        // TODO: remove any event listeners & kill any animations
        // Cancel the existing timer (if any) and create a new one
        clearTimeout(this.endSceneTimer);
        this.endSceneTimer = setTimeout(() => {
            SceneManager.changeScene(new GameScene2(SceneManager.width, SceneManager.height));
        }, 2000);
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
