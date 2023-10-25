import { AnimatedSprite, Sprite, Text } from "pixi.js";

export interface Story {
  scenes: StoryScene[];
}

export interface StoryScene {
  scene: number;
  fragments: FragmentData[];
}

export interface FragmentData {
  id: string;
  text: string;
  animation?: string;
  sound?: string;
}

export interface ConfigFragment {
  id: string;
  fragText: Text;
  sprite?: Sprite;
  animatedSprites?: AnimatedSprite[];
  sounds?: string[]
}
