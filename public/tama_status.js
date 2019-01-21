class HungHapScreen extends Phaser.Scene {
    constructor() {
        super({ key: "hungHapScreen" });
    }

    preload() {
        this.load.spritesheet('heart', 'assets/heart.png', { frameWidth: 70, frameHeight: 70 });

    }

    create() {
        /* import UI scene */
        const sceneUI = this.scene.get('UI');

        this.cameras.main.setBackgroundColor('#FFFFFF')
        this.scene.moveDown();

        this.hungerText = this.add.text(60, 60, "Back/Hunger", { color: "#000000", fontSize: "40px" })
            .setInteractive({ useHandCursor: true });
        this.row1 = this.add.group({
            key: "heart",
            frame: [0, 0, 1, 1],
            setXY: {
                x: 95,
                y: 155,
                stepX: 70
            }
        });
        this.happyText = this.add.text(60, 200, "Next/Happy", { color: "#000000", fontSize: "40px" })
            .setInteractive({ useHandCursor: true });
        this.row2 = this.add.group({
            key: "heart",
            frame: [0, 1, 1, 1],
            setXY: {
                x: 95,
                y: 295,
                stepX: 70
            }
        });

        /* listeners */
        this.hungerText.on('pointerdown', () => {
            sceneUI.enableButtons();
            this.scene.remove('hungHapScreen');
            this.scene.remove('trainScreen');
        });
        this.happyText.on('pointerdown', () => {
            this.scene.switch('trainScreen');
        });

        //TODO add listener for training screen
    }
}

class TrainScreen extends Phaser.Scene {
    constructor() {
        super({ key: "trainScreen" });
    }

    preload() {
        this.load.image('bar', 'assets/bar.png');
    }

    create() {
        /* import UI scene */
        const sceneUI = this.scene.get('UI');

        this.cameras.main.setBackgroundColor('#FFFFFF');
        this.scene.moveDown();

        this.trainingText = this.add.text(60, 170, "Next/Training", { color: "#000000", fontSize: "32px" })
            .setInteractive({ useHandCursor: true });
        this.trainingBar = this.add.image(200, 240, 'bar').setDisplaySize(260, 60);

        /* listeners */
        this.trainingText.on('pointerdown', () => {
            this.scene.switch('hungHapScreen');
        });
    }
}