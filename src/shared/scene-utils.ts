import { DisplayObject, Graphics, Text } from "pixi.js";
import { gsap } from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";
import { FragmentData, StoryScene } from "./story-model";
import { ScenesConfig } from '../config/scenesConfig';

gsap.registerPlugin(PixiPlugin);

// Define a new class or module that contains the reusable methods
export class SceneUtils {
  // TODO: I may need to use these properties going forward
  // visitedFragments: number[] = [];
  // allVisited = false;

  static addSceneData(
    sceneData: StoryScene,
    addChild: (child: DisplayObject) => void,
    addStoryButton: (index: number, fragment: FragmentData, fragmentText: Text, animation: any) => void,
    assignAnimation: (id: string) => any,
  ) {
    console.log('scene number', sceneData.scene);
    // populate scene with fragments with their corresponding animations & story activation buttons
    sceneData.fragments.forEach((fragment: FragmentData, i: number) => {
      const animation = assignAnimation(fragment.id);
      const fragmentText = new Text(fragment.text, ScenesConfig.fragmentStyle);
      fragmentText.position.set(fragment.position[0], fragment.position[1]);
      fragmentText.alpha = 0;

      addChild(fragmentText);
      addStoryButton(i, fragment, fragmentText, animation);
    });
  }

  static addStoryButton(
    addChild: (child: DisplayObject) => void,
    storyButtonList: Graphics[],
    activateFragment: (fragment: FragmentData, fragmentText: Text, animation: any) => void,
    deactivateFragment: (fragment: FragmentData, fragmentText: Text, animation: any) => void,
    updateVisitedFragments: (index: number) => void,
    endScene: () => void,
    allVisited: boolean,
    index: number,
    fragment: FragmentData,
    fragmentText: Text,
    animation: any,
    endSceneTimer: number,
  ) {
    const storyButton = new Graphics()
      .beginFill('hsl(204 30% 70% / 0.4)')
      .drawCircle(0, 0, 30);
    storyButtonList.push(storyButton);
    storyButton.position.set(fragment.button[0], fragment.button[1]);
    storyButton.eventMode = 'static';
    storyButton.cursor = 'pointer';
    // ACTIVATE story fragment
    storyButton.on('pointerenter', () => {
      activateFragment(fragment, fragmentText, animation);
      updateVisitedFragments(index);
      // Cancel the existing timer (if any)
      clearTimeout(endSceneTimer);
    });
    // DEACTIVATE story fragment
    storyButton.on('pointerleave', () => {
      deactivateFragment(fragment, fragmentText, animation);
      // show story button as visited
      gsap.to(storyButtonList[index], {
        pixi: { alpha: 0.6 },
        duration: 0.5,
      });
      if (allVisited) {
        console.log('SceneUtils allVisited', allVisited);
        endScene();
      }
    });
    addChild(storyButton);
  }


}
