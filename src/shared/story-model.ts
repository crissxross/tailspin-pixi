import { Sprite, Text } from "pixi.js";

export interface Story {
  scenes: StoryScene[];
}

export interface StoryScene {
  scene: number;
  fragments: Fragment[];
}

export interface Fragment {
  id: string;
  text: string;
  animation?: string;
  sound?: string;
}

export interface ConfigFragment {
  id: string;
  fragText: Text;
  sprite: Sprite;
}
