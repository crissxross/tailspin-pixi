import { AnimatedSprite, Sprite, Texture } from 'pixi.js';
import { gsap } from "gsap";
import { FragmentData } from '../shared/story-model';
import { BaseScene } from './base-scene';
// next & previous scenes
import { Scene5 } from './scene5';
import { Scene3 } from './scene3';

export class Scene4 extends BaseScene {
  nextScene = Scene5;
  previousScene = Scene3;

  constructor(parentWidth: number, parentHeight: number, scIndex: number, nextScene: any, previousScene?: any) {
    super(parentWidth, parentHeight, scIndex, nextScene, previousScene);
  }

  init(parentWidth: number, parentHeight: number): void {
    this.addChild(this.buttonsContainer);
    this.addChild(this.animContainer);
    this.addSceneData();

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
      // case '??':
      //   return ??;
      // case '??':
      //   return ??;
      default:
        return null;
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

}

