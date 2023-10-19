import { AnimatedSprite, Container, Sprite, Text, TextStyle, Texture } from 'pixi.js';
import { IScene, SceneManager } from '../shared/scene-manager';
import { GameScene1 } from './game-scene1';

export class GameScene2 extends Container implements IScene {
    sky: Sprite;
    text: Text;
    explosion: AnimatedSprite;
    explosionTextures: Texture[] = [];

    constructor(parentWidth: number, parentHeight: number) {
        super();

        //you can remove all of this code
        //initialize sprites
        this.sky = Sprite.from("sky");
        this.sky.anchor.set(0.5);
        this.sky.width = parentWidth;
        this.sky.height = parentHeight;
        this.sky.position.x = parentWidth * 0.5;
        this.sky.position.y = parentHeight * 0.5;

        const style = new TextStyle({
            fontFamily: "system-ui",
            fontSize: 30,
            fontWeight: "bold",
            align: "center",
            lineHeight: 50,
            wordWrap: true,
            wordWrapWidth: parentWidth * 0.80,
            fill: ['#ffffff', "hsl(30 100% 80%)"],
            stroke: "hsl(30 100% 30%)",
            strokeThickness: 3,
            dropShadow: true,
            dropShadowColor: "hsl(0 0% 50% / 0.5)",
            dropShadowBlur: 4,
            dropShadowAngle: Math.PI / 6,
            dropShadowDistance: 2,
        });

        this.text = new Text(`
        Scene 2 - end of demo.
        Click to go back to the first scene.`,
        style,
        );

        this.text.anchor.set(0.5);
        this.text.position.x = parentWidth * 0.5;
        this.text.position.y = parentHeight * 0.5;
        this.text.eventMode = 'static';
        this.text.cursor = 'pointer';
        this.text.on('pointerdown', () => { SceneManager.changeScene(new GameScene1(SceneManager.width, SceneManager.height)); });

        for (let i = 1; i < 28; i++) {
            const texture = Texture.from(`Explosion_Sequence_A ${i}.png`);
            this.explosionTextures.push(texture)
        }
        this.explosion = new AnimatedSprite(this.explosionTextures);
        this.explosion.anchor.set(0.5);
        this.explosion.position.x = parentWidth * 0.5;
        this.explosion.position.y = parentHeight * 0.75;
        this.explosion.loop = false;
        this.explosion.animationSpeed = 0.3;
        this.explosion.play();

        this.addChild(this.sky, this.text, this.explosion);

    }

    update(framesPassed: number): void {
        // console.log('update framesPassed: ', framesPassed);
    }

    resize(parentWidth: number, parentHeight: number): void {
        // TODO: why doesn't this resize anything?

        this.sky.width = parentWidth;
        this.sky.height = parentHeight;

    }
}
