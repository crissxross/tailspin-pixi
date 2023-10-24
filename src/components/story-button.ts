import { ButtonContainer } from "@pixi/ui";
import { Container, Graphics } from "pixi.js";
import { ConfigFragment } from "../shared/story-model";

export class StoryButton extends Container  {
  button: ButtonContainer;

  constructor(
    configFragment: ConfigFragment,
    onclick: (configFragment: ConfigFragment) => void
  ) {
    super();

    this.button = new ButtonContainer(
    new Graphics()
        .beginFill('hsl(200 40% 80% / 0.5)')
        .drawCircle(0, 0, 40)
  );

  this.button.onPress.connect(() => {
    console.log('onPress');
    onclick(configFragment);
  });

  this.addChild(this.button);
  }
}
