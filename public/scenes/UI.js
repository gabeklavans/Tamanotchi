export default class UI extends Phaser.Scene {
    constructor() {
        super({ key: "UI", active: true });
    }

    enableButtons() {
        Phaser.Actions.Call(this.buttons.getChildren(), button => {
            button.setInteractive({ useHandCursor: true });
        }, this);
    }

    disableButtons() {
        Phaser.Actions.Call(this.buttons.getChildren(), button => {
            button.disableInteractive();
        }, this);
    }

    preload() {
        this.load.image('background', 'assets/Tama_Frame.png');
        this.load.image('pixel', 'assets/black.png');
        this.load.image('flushButton', 'assets/toilet.png');
        this.load.image('burger', 'assets/burger.jpg');
        this.load.image('scale', 'assets/scale.png');
    }

    create() {
        /* import main loop scene*/
        const sceneMain = this.scene.get('Main');

        /* add interface */
        this.bg = this.add.image(200, 200, 'background').setDepth(1);
        this.buttons = this.add.group();
        //370
        this.flushButton = this.add.image(200, 30, 'flushButton')
            .setDepth(2)
            .setDisplaySize(30, 30);
        this.foodButton = this.add.image(120, 30, 'burger')
            .setDepth(2)
            .setDisplaySize(30, 30);
        this.healthButton = this.add.image(30, 30, 'scale')
            .setDepth(2)
            .setDisplaySize(30, 30);
        this.buttons.add(this.flushButton);
        this.buttons.add(this.foodButton);
        this.buttons.add(this.healthButton);
        this.pixel = this.add.image(20, 20, 'pixel').setDisplaySize(1, 1).setDepth(2).setInteractive({ useHandCursor: true });

        this.enableButtons();

        /* listeners for UI */
        this.flushButton.on('pointerdown', () => {
            this.disableButtons();
            sceneMain.flush();
        });

        this.foodButton.on('pointerdown', () => {
            this.disableButtons();
            this.scene.add('eatCutscene', EatCutscene, true);
        });

        this.healthButton.on('pointerdown', () => {
            this.disableButtons();
            this.scene.add('hungHapScreen', HungHapScreen, true);
            this.scene.add('trainScreen', TrainScreen, false);
            this.scene.add('ageWeightNameScreen', AgeWeightNameScreen, false);
            this.scene.add('sexGenerationScreen', SexGenerationScreen, false);
        })

        this.pixel.on('pointerdown', () => {
            this.events.emit('empowered');
        });
    }
}