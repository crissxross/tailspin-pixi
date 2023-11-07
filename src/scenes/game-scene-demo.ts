import { AnimatedSprite, Container, Sprite, Text, TextStyle, Texture } from 'pixi.js';
import { gsap } from "gsap";
// import { PixiPlugin } from "gsap/PixiPlugin";
import { IScene, SceneManager } from '../shared/scene-manager';
import { GameScene1 } from './game-scene1';

export class GameSceneDemo extends Container implements IScene {
    sky: Sprite;
    mint: AnimatedSprite;
    mintTextures: Texture[] = [];
    explosion: AnimatedSprite;
    explosionTextures: Texture[] = [];
    text!: Text;

    constructor(parentWidth: number, parentHeight: number) {
        super();
        // initialize/load content
        this.sky = Sprite.from("sky");

        for (let i = 0; i < 6; i++) {
            const texture = Texture.from(`Mint000${i}`);
            this.mintTextures.push(texture)
        }
        this.mint = new AnimatedSprite(this.mintTextures);

        for (let i = 1; i < 28; i++) {
            const texture = Texture.from(`Explosion_Sequence_A ${i}.png`);
            this.explosionTextures.push(texture)
        }
        this.explosion = new AnimatedSprite(this.explosionTextures);

        this.init(parentWidth, parentHeight);
    }

    init(parentWidth: number, parentHeight: number) {
        this.addSky(parentWidth, parentHeight);
        this.addExplosion(parentWidth, parentHeight);
        this.addText(parentWidth, parentHeight);
    }

    addSky(parentWidth: number, parentHeight: number) {
        this.sky.anchor.set(0.5);
        this.sky.width = parentWidth;
        this.sky.height = parentHeight;
        this.sky.position.x = parentWidth * 0.5;
        this.sky.position.y = parentHeight * 0.5;
        this.sky.alpha = 0;
        this.addChild(this.sky);
        gsap.to(this.sky, {
            pixi: { alpha: 1 },
            duration: 1,
        });
    }

    addExplosion(parentWidth: number, parentHeight: number) {
        this.explosion.anchor.set(0.5);
        this.explosion.position.x = parentWidth * 0.5;
        this.explosion.position.y = parentHeight * 0.75;
        this.explosion.loop = false;
        this.explosion.animationSpeed = 0.3;
        this.addChild(this.explosion);
        this.explosion.play();
    }

    addText(parentWidth: number, parentHeight: number) {
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
        Scene demo... END.
        Click to go back to the first scene.`,
        style,
        );

        this.text.anchor.set(0.5);
        this.text.position.x = parentWidth * 0.5;
        this.text.position.y = parentHeight * 0.5;
        this.text.eventMode = 'static';
        this.text.cursor = 'pointer';
        this.text.on('pointerdown', () => { SceneManager.changeScene(new GameScene1(SceneManager.width, SceneManager.height)); });

        this.addChild(this.text);
    }

    update(framesPassed: number) {
        // console.log('update framesPassed: ', framesPassed);
    }

    resize(parentWidth: number, parentHeight: number) {
        // TODO: why doesn't this resize anything?

        this.sky.width = parentWidth;
        this.sky.height = parentHeight;

    }
}
