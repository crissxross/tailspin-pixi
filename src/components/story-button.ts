import { ButtonContainer } from "@pixi/ui";
import { Container, Graphics, Sprite, Text } from "pixi.js";

export class StoryButton extends Container  {
  button: ButtonContainer;

  constructor(
    fragText: Text,
    sprite: Sprite,
    onclick: (fragText: Text, sprite: Sprite) => void
  ) {
    super();

    this.button = new ButtonContainer(
    new Graphics()
        .beginFill('hsl(200 40% 80% / 0.5)')
        .drawCircle(0, 0, 40)
  );

  this.button.onPress.connect(() => {
    console.log('onPress');
    onclick(fragText, sprite);
  });

  this.addChild(this.button);
  }
}
