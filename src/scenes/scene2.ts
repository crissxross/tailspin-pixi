import { AnimatedSprite, Sprite, Texture } from 'pixi.js';
import { gsap } from "gsap";
import { FragmentData } from '../shared/story-model';
import { BaseScene } from './base-scene';
// next & previous scenes
import { Scene3 } from './scene3';
import { Scene1 } from './scene1';

export class Scene2 extends BaseScene {
  sky: Sprite;
  mint: AnimatedSprite;
  mintTextures: Texture[] = [];
  butch: AnimatedSprite;
  butchTextures: Texture[] = [];
  explosion: AnimatedSprite;
  explosionTextures: Texture[] = [];
  nextScene = Scene3;
  previousScene = Scene1;

  constructor(parentWidth: number, parentHeight: number, scIndex: number, nextScene: any, previousScene?: any) {
    super(parentWidth, parentHeight, scIndex, nextScene, previousScene);

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
  }

  init(parentWidth: number, parentHeight: number): void {
    this.addChild(this.buttonsContainer);
    this.addChild(this.animContainer);
    // this.addSky(parentWidth, parentHeight);
    this.addSceneData();

    this.addMint(parentWidth, parentHeight);
    this.addButch(parentWidth, parentHeight);
    this.addExplosion(parentWidth, parentHeight);

    this.addStoryBtnAnimation();
    // quick nav buttons
    if (this.nextSceneIndex !== undefined){
      this.uiNext(this.nextScene, this.nextSceneIndex, parentWidth, parentHeight);
    }
    if (this.previousSceneIndex !== undefined){
      this.uiPrevious(this.previousScene, this.previousSceneIndex, parentHeight);
    }
  }

  addStoryBtnAnimation() {
    this.sceneData.fragments.forEach((fragment: FragmentData, i: number) => {
      const animation = this.assignAnimation(fragment.id);
      this.storyButtons[i].on('pointerenter', () => {
        if (animation) this.activateFragmentAnimation(animation);
      });
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
    }
  }

  activateFragmentAnimation(animation: any) {
    gsap.to(animation, {
      pixi: { alpha: 1 },
      duration: 2,
    });
    // play the AnimatedSprite
    animation.play();
  }

  // SCENE SPECIFIC ----------------------------

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


}
