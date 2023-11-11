import { AnimatedSprite, Assets, Container, DisplayObject, Graphics, Sprite, Text, Texture } from 'pixi.js';
import { sound } from "@pixi/sound";
import { gsap } from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";
import { IScene, SceneManager } from '../shared/scene-manager';
import { FragmentData, StoryScene } from '../shared/story-model';
import { ScenesConfig } from '../config/scenesConfig';
import { BaseScene } from './base-scene';
// next scene
import { GameScene2 } from './game-scene2';

export class Scene1 extends BaseScene {
  // specific to this scene
  innerEar: Sprite;
  goldie: AnimatedSprite;
  goldieTextures: Texture[] = [];
  mint: AnimatedSprite;
  mintTextures: Texture[] = [];
  purrl: AnimatedSprite;
  purrlTextures: Texture[] = [];
  nextScene = GameScene2;

  constructor(parentWidth: number, parentHeight: number, scNum: number, nextScene: any) {
    super(parentWidth, parentHeight, scNum, nextScene);

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
  }

  init(parentWidth: number, parentHeight: number) {
    this.addChild(this.buttonsContainer);
    this.addChild(this.animContainer);
    this.addInnerEar(parentWidth, parentHeight);
    this.addSceneData();

    this.addGoldie(parentWidth, parentHeight);
    this.addMint(parentWidth, parentHeight);
    this.addPurrl(parentWidth, parentHeight);

    console.log('storyButtonList', this.storyButtonList);
    console.log('sceneData', this.sceneData);

    this.sceneData.fragments.forEach((fragment: FragmentData, i: number) => {
      const animation = this.assignAnimation(fragment.id);
      // console.log('animation for index', i, animation);
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








  // SPECIFIC TO THIS SCENE -----------------------------

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
