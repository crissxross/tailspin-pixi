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
  position: number[];
  button: number[];
  sounds?: string[];
  animation?: string;
}

export interface ConfigFragment {
  index: number;
  id: string;
  visited: boolean;
  fragText: Text;
  sounds?: string[]
  sprite?: Sprite;
  animation: any;
  // animatedSprites?: AnimatedSprite[];
}
