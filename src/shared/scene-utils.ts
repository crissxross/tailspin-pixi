import { DisplayObject, Graphics, Text } from 'pixi.js';
// import { sound } from "@pixi/sound";
import { gsap } from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";
import { FragmentData, StoryScene } from './story-model';
import { ScenesConfig } from '../config/scenesConfig';

gsap.registerPlugin(PixiPlugin);

PixiPlugin.registerPIXI({
    DisplayObject: DisplayObject,
});

export function addSceneData(
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

export function createStoryButton(
  storyButtonList: Graphics[],
  activateFragment: (fragment: FragmentData, fragmentText: Text, animation: any) => void,
  deactivateFragment: (fragment: FragmentData, fragmentText: Text, animation: any) => void,
  updateVisitedFragments: (index: number) => void,
  index: number,
  fragment: FragmentData,
  fragmentText: Text,
  animation: any,
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
    });
    // DEACTIVATE story fragment
    storyButton.on('pointerleave', () => {
      deactivateFragment(fragment, fragmentText, animation);
      // show story button as visited
      gsap.to(storyButtonList[index], {
        pixi: { alpha: 0.6 },
        duration: 0.5,
      });
    });
    return storyButton;
}

export function checkAllVisited(visitedFragments: number[], index: number, sceneData: StoryScene) {
  if(visitedFragments.includes(index)) return;
  visitedFragments.push(index);
  console.log('visitedFragments', visitedFragments);
  if (visitedFragments.length === sceneData.fragments.length) {
    return true;
  }

}
