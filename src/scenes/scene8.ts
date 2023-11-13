import { AnimatedSprite, Sprite, Text, TextStyle, Texture } from 'pixi.js';
import { gsap } from "gsap";
import { FragmentData } from '../shared/story-model';
import { BaseScene } from './base-scene';
// previous scene
import { Scene7 } from './scene7';
import { SceneManager } from '../shared/scene-manager';
import { Scene1 } from './scene1';
import { ScenesConfig } from '../config/scenesConfig';

// THIS IS THE ENDING SCENE

export class Scene8 extends BaseScene {
  previousScene = Scene7;

  // TODO: remove - just for testing - originally from game-scene-demo.ts
  sky: Sprite;
  explosion: AnimatedSprite;
  explosionTextures: Texture[] = [];
  fragText!: Text;
  uiText!: Text;

  constructor(parentWidth: number, parentHeight: number, scIndex: number, nextScene: any, previousScene?: any) {
    super(parentWidth, parentHeight, scIndex, nextScene, previousScene);

    // test/demo content
    this.sky = Sprite.from("sky");

    for (let i = 1; i < 28; i++) {
      const texture = Texture.from(`Explosion_Sequence_A ${i}.png`);
      this.explosionTextures.push(texture)
    }
    this.explosion = new AnimatedSprite(this.explosionTextures);
  }

  init(parentWidth: number, parentHeight: number): void {
    this.addChild(this.animContainer);
    this.addChild(this.buttonsContainer);
    // test/demo content
    this.addSky(parentWidth, parentHeight);
    this.addExplosion(parentWidth, parentHeight);
    this.addUiText(parentWidth, parentHeight);

    // real content
    this.addFragText(parentWidth, parentHeight);

    // TODO: temporary, this is unnecessary
    this.addSceneData();

    // quick nav button
    if (this.previousSceneIndex !== undefined){
      this.uiPrevious(this.previousScene, this.previousSceneIndex, parentHeight);
    }
  }

  addFragText(parentWidth: number, parentHeight: number) {
    this.fragText = new Text(this.sceneData.fragments[0].text, ScenesConfig.fragmentStyle);
    this.fragText.anchor.set(0.5);
    this.fragText.position.x = parentWidth * 0.5;
    this.fragText.position.y = parentHeight * 0.3;
    this.fragText.alpha = 0;
    this.animContainer.addChild(this.fragText);
    gsap.to(this.fragText, {
        pixi: { alpha: 1 },
        duration: 5,
    });
  }


  // test/demo content -------------------------------------

  addSky(parentWidth: number, parentHeight: number) {
    this.sky.anchor.set(0.5);
    this.sky.width = parentWidth;
    this.sky.height = parentHeight;
    this.sky.position.x = parentWidth * 0.5;
    this.sky.position.y = parentHeight * 0.5;
    this.sky.alpha = 0;
    this.animContainer.addChild(this.sky);
    gsap.to(this.sky, {
        pixi: { alpha: 1 },
        duration: 1,
    });
  }

addExplosion(parentWidth: number, parentHeight: number) {
    this.explosion.anchor.set(0.5);
    this.explosion.position.x = parentWidth * 0.5;
    this.explosion.position.y = parentHeight * 0.75;
    this.explosion.loop = false;
    this.explosion.animationSpeed = 0.3;
    this.animContainer.addChild(this.explosion);
    this.explosion.play();
}

addUiText(parentWidth: number, parentHeight: number) {
    const style = new TextStyle({
        fontFamily: "system-ui",
        fontSize: 30,
        fontWeight: "bold",
        align: "center",
        lineHeight: 50,
        wordWrap: true,
        wordWrapWidth: parentWidth * 0.80,
        fill: ['#ffffff', "hsl(30 100% 80%)"],
        stroke: "hsl(30 100% 30%)",
        strokeThickness: 3,
        dropShadow: true,
        dropShadowColor: "hsl(0 0% 50% / 0.5)",
        dropShadowBlur: 4,
        dropShadowAngle: Math.PI / 6,
        dropShadowDistance: 2,
    });

    this.uiText = new Text(`
    Scene 8... END.
    Click to go back to the first scene.`,
    style,
    );

    this.uiText.anchor.set(0.5);
    this.uiText.position.x = parentWidth * 0.5;
    this.uiText.position.y = parentHeight * 0.5;
    this.uiText.eventMode = 'static';
    this.uiText.cursor = 'pointer';
    this.uiText.on('pointerdown', () => { SceneManager.changeScene(new Scene1(SceneManager.width, SceneManager.height, 0, Scene1)); });

    this.addChild(this.uiText);
  }

}

