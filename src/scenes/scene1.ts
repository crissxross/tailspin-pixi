import { AnimatedSprite, Sprite, Texture } from 'pixi.js';
import { Sound, sound } from "@pixi/sound";
import { gsap } from "gsap";
import { FragmentData } from '../shared/story-model';
import { BaseScene } from './base-scene';
// next scene
import { Scene2 } from './scene2';

export class Scene1 extends BaseScene {
  innerEar: Sprite;
  goldie: AnimatedSprite;
  goldieTextures: Texture[] = [];
  mint: AnimatedSprite;
  mintTextures: Texture[] = [];
  purrl: AnimatedSprite;
  purrlTextures: Texture[] = [];
  nextScene = Scene2;

  constructor(parentWidth: number, parentHeight: number, scIndex: number, nextScene: any) {
    super(parentWidth, parentHeight, scIndex, nextScene);

    this.innerEar = Sprite.from("innerEar");

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
    // this.cutlery = "cutleryonplates2";
  }

  init(parentWidth: number, parentHeight: number) {
    this.addChild(this.buttonsContainer);
    this.addChild(this.animContainer);
    this.addInnerEar(parentWidth, parentHeight);
    this.addSceneData();

    this.addGoldie(parentWidth, parentHeight);
    this.addMint(parentWidth, parentHeight);
    this.addPurrl(parentWidth, parentHeight);

    this.addStoryBtnAnimation();
    // quick nav button
    if (this.nextSceneIndex !== undefined){
      this.uiNext(this.nextScene, this.nextSceneIndex, parentWidth, parentHeight);
    }

    // sounds
    this.playSound({
      soundName: "waves-hiSoft1",
      loop: true,
      volume: 0.1
    });

    this.playSoundWithFadeOut({
      soundName: "cutleryonplates2",
      loop: true,
      volume: 0.1,
      fadeDuration: 3,
      delay: 6000,
    });
  }

  addStoryBtnAnimation() {
    this.sceneData.fragments.forEach((fragment: FragmentData, i: number) => {
      const animation = this.assignAnimation(fragment.id);
      // console.log('storyButtons index', i, this.storyButtons[i], 'animation for', i, animation);
      this.storyButtons[i].on('pointerenter', () => {
        if (animation) this.activateFragmentAnimation(animation);
      });
    });
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

  activateFragmentAnimation(animation: any) {
    gsap.to(animation, {
      pixi: { alpha: 1 },
      duration: 2,
    });
    // play the AnimatedSprite
    animation.play();
  }

  // TODO: do I need to reactivate any animations?

  // TODO: check that all animations have a finite length and will play through to their end (or end of scene). If not, add:
  // deactivateFragmentAnimation(animation: any) {}

  // playSound(soundName: string, loop = true, volume: number) {
  //   sound.play(soundName, {loop: loop, volume: volume});
  // }

  // stopSound(soundName: string) {
  //   sound.stop(soundName);
  // }


  // SCENE SPECIFIC artwork & animation

  addGoldie(parentWidth: number, parentHeight: number) {
    this.goldie.anchor.set(0.5, 1);
    this.goldie.scale.set(0.9);
    this.goldie.position.x = parentWidth * 0.15;
    this.goldie.position.y = parentHeight * 0.94;
    this.goldie.loop = true;
    this.goldie.animationSpeed = 0.2;
    this.goldie.alpha = 0;
    this.animContainer.addChild(this.goldie);
    console.log('goldie', this.goldie.position.x, this.goldie.position.y);
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
      console.log('mint', this.mint.position.x, this.mint.position.y);
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
      console.log('purrl', this.purrl.position.x, this.purrl.position.y);
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


}
