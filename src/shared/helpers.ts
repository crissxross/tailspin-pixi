import { Container, Text } from "pixi.js";
import { ScenesConfig } from '../config/scenesConfig';
import { FragmentData, StoryScene } from "./story-model";


export function addSceneData(
  scene: Container,
  sceneData: StoryScene,
  // assignAnimation: (id: string) => any,
  // addStoryButton: (i: number, fragment: FragmentData, fragmentText: Text, animation: any) => void
  ) {
  console.log('scene number', sceneData.scene);
  // populate scene with fragments with their corresponding animations & story activation buttons
  sceneData.fragments.forEach((fragment: FragmentData, i) => {
    // console.log(`${i}: ${fragment.id} - ${fragment.text}`);
    // const animation = assignAnimation(fragment.id);
    // console.log('animation for index', i, animation);
    const fragmentText = new Text(fragment.text, ScenesConfig.fragmentStyle);
    fragmentText.position.set(fragment.position[0], fragment.position[1]);
    fragmentText.alpha = 0.5;

    scene.addChild(fragmentText);
    // addStoryButton(i, fragment, fragmentText, animation);
  });
}
