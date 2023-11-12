import { Assets, Container, DisplayObject, Graphics, Text } from 'pixi.js';
import { sound } from "@pixi/sound";
import { gsap } from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";
import { IScene, SceneManager } from '../shared/scene-manager';
import { FragmentData, StoryScene } from '../shared/story-model';
import { ScenesConfig } from '../config/scenesConfig';

gsap.registerPlugin(PixiPlugin);

PixiPlugin.registerPIXI({
    DisplayObject: DisplayObject,
});

export class BaseScene extends Container implements IScene {
  storyButton!: Graphics;
  sceneData!: StoryScene;
  fragData!: FragmentData;
  buttonsContainer: Container;
  animContainer: Container;
  visitedFragments: number[] = [];
  allVisited = false;
  endSceneTimer!: number;
  storyButtons: Graphics[] = [];
  nextScene: any;
  nextSceneIndex!: number;
  previousScene: any | undefined;
  previousSceneIndex!: number | undefined;

  constructor(parentWidth: number, parentHeight: number, scIndex: number, nextScene: any, previousScene?: any) {
    super();

    this.buttonsContainer = new Container();
    this.animContainer = new Container();
    this.nextScene = nextScene;
    this.nextSceneIndex = scIndex + 1;
    this.previousScene = scIndex > 0 ? previousScene : undefined;
    this.previousSceneIndex = scIndex > 0 ? scIndex - 1 : undefined;
    console.log('scIndex', scIndex);
    console.log('nextSceneIndex', this.nextSceneIndex);
    console.log('previousSceneIndex', this.previousSceneIndex);

    Assets.load('assets/tailspinScenes.json').then((data) => {
      this.sceneData = data[scIndex];
      this.init(parentWidth, parentHeight);
    });
  }

  init(parentWidth: number, parentHeight: number) {
    this.addChild(this.buttonsContainer);
    this.addChild(this.animContainer);
    this.addSceneData();
  }

  addSceneData() {
    // populate scene with fragments with their story activation buttons
    this.sceneData.fragments.forEach((fragment: FragmentData, i: number) => {
      const fragmentText = new Text(fragment.text, ScenesConfig.fragmentStyle);
      fragmentText.position.set(fragment.position[0], fragment.position[1]);
      fragmentText.alpha = 0;

      this.addChild(fragmentText);
      this.createStoryButton(i, fragment, fragmentText);
    });
  }

  createStoryButton(index: number, fragment: FragmentData, fragmentText: Text,) {
    const storyButton = new Graphics()
      .beginFill('hsl(204 30% 70% / 0.4)')
      .drawCircle(0, 0, 30);
    this.storyButtons.push(storyButton);
    storyButton.position.set(fragment.button[0], fragment.button[1]);
    storyButton.eventMode = 'static';
    storyButton.cursor = 'pointer';
    // ACTIVATE story fragment
    storyButton.on('pointerenter', () => {
      this.activateFragment(fragment, fragmentText);
      this.updateVisitedFragments(index);
      // Cancel the existing timer (if any)
      clearTimeout(this.endSceneTimer);
    });
    // DEACTIVATE story fragment
    storyButton.on('pointerleave', () => {
      this.deactivateFragment(fragment, fragmentText);
      // show story button as visited
      gsap.to(this.storyButtons[index], {
        pixi: { alpha: 0.6 },
        duration: 0.5,
      });
      if (this.allVisited) {
        this.endScene(this.nextScene, this.nextSceneIndex);
      }
    });
    this.buttonsContainer.addChild(storyButton);
  }

  activateFragment(fragment: FragmentData, fragText: Text) {
    gsap.to(fragText, {
      pixi: { alpha: 1 },
      duration: 1,
    });
    if (fragment.sounds) {
        fragment.sounds.forEach(s => sound.play(s));
    }
  }

  deactivateFragment(fragment: FragmentData, fragText: Text) {
    gsap.to(fragText, {
      pixi: { alpha: 0 },
      duration: 1,
    });
  }

  checkAllVisited(visitedFragments: number[], index: number, sceneData: StoryScene) {
    if(visitedFragments.includes(index)) return;
    visitedFragments.push(index);
    // console.log('visitedFragments', visitedFragments);
    if (visitedFragments.length === sceneData.fragments.length) {
      return true;
    }
  }

  updateVisitedFragments(index: number) {
    if (this.checkAllVisited(this.visitedFragments, index, this.sceneData)) {
      this.allVisited = true;
      console.log('allVisited', this.allVisited);
    }
  }

  endScene(nextScene: any, nextIndex: number) {
    console.log('endScene nextScene:', nextScene);
    // Cancel the existing timer (if any) & create a new one
    clearTimeout(this.endSceneTimer);
    this.endSceneTimer = setTimeout(() => {
        gsap.timeline({onComplete: this.goToNextScene, onCompleteParams: [nextScene, nextIndex]})
            .to([this.animContainer, this.buttonsContainer], {
                pixi: { alpha: 0 },
                duration: 1.5,
            });
    }, 2000);
  }

  goToNextScene(nextScene: any, nextIndex: number) {
    console.log('goToNextScene nextIndex', nextIndex);
    // TODO: remove any event listeners, kill any animations & fade out & stop any sounds
    SceneManager.changeScene(new nextScene(SceneManager.width, SceneManager.height, nextIndex, nextScene));
  }
  // TODO: should I rename the nextScene param to (copilot suggested) nextSceneClass?

  uiNext(nextScene: any, nextIndex: number, parentWidth: number, parentHeight: number,) {
    if (nextIndex > this.sceneData.fragments.length - 1) return;
    const text = new Text(`>>`, ScenesConfig.uiStyle);
    text.position.x = parentWidth - text.width - 20;
    text.position.y = parentHeight - text.height - 10;
    text.eventMode = 'static';
    text.cursor = 'pointer';
    text.on('pointerdown', () => { SceneManager.changeScene(new nextScene(SceneManager.width, SceneManager.height, nextIndex, nextScene)); });
    this.addChild(text);
  }

  uiPrevious(previousScene: any, previousIndex: number, parentHeight: number,) {
    if (previousIndex < 0) return;
    const text = new Text(`<<`, ScenesConfig.uiStyle);
    text.position.x = 20;
    text.position.y = parentHeight - text.height - 10;
    text.eventMode = 'static';
    text.cursor = 'pointer';
    text.on('pointerdown', () => { SceneManager.changeScene(new previousScene(SceneManager.width, SceneManager.height, previousIndex, previousScene)); });
    this.addChild(text);
  }


  // TODO: methods below from template - do I need them in this app?
  update(framesPassed: number) {
    // console.log('update framesPassed: ', framesPassed);
  }

  resize(parentWidth: number, parentHeight: number) {
      // TODO: why doesn't this resize anything?
  }
}
