import { ButtonContainer } from "@pixi/ui";
import { Container, Graphics } from "pixi.js";
import { ConfigFragment } from "../shared/story-model";

export class StoryButton extends Container  {
  button: ButtonContainer;

  constructor(
    configFragment: ConfigFragment,
    onclick: (configFragment: ConfigFragment) => void,
    onup: (configFragment: ConfigFragment) => void
  ) {
    super();

    this.button = new ButtonContainer(
    new Graphics()
        .beginFill('hsl(204 30% 70% / 0.4)')
        .drawCircle(0, 0, 40)
  );

  this.button.onPress.connect(() => {
    console.log('onPress');
    onclick(configFragment);
  });

  this.button.onUp.connect(() => {
    console.log('onUp');
    onup(configFragment);
  });

  this.addChild(this.button);
  }
}
