export default class HungHapScreen extends Phaser.Scene {
    constructor() {
        super({ key: "hungHapScreen" });
    }

    preload() {
        this.load.spritesheet('heart', 'assets/heart.png', { frameWidth: 70, frameHeight: 70 });
        
        this.scene.add('trainScreen', TrainScreen, false);
        this.scene.add('ageWeightNameScreen', AgeWeightNameScreen, false);
        this.scene.add('sexGenerationScreen', SexGenerationScreen, false);
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
            this.scene.remove('ageWeightNameScreen');
            this.scene.remove('sexGenerationScreen');
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
        this.cameras.main.setBackgroundColor('#FFFFFF');
        this.scene.moveDown();

        this.trainingText = this.add.text(60, 170, "Next/Training", { color: "#000000", fontSize: "32px" })
            .setInteractive({ useHandCursor: true });
        this.trainingBar = this.add.image(200, 240, 'bar').setDisplaySize(260, 60);

        /* listeners */
        this.trainingText.on('pointerdown', () => {
            this.scene.switch('ageWeightNameScreen');
        });
    }
}

class AgeWeightNameScreen extends Phaser.Scene {
    constructor() {
        super({ key: "ageWeightNameScreen" });
    }

    preload() {
    }

    create() {
        this.cameras.main.setBackgroundColor('#FFFFFF');
        this.scene.moveDown();

        this.tama = this.add.image(95, 95, 'burger').setDisplaySize(60, 60);
        this.ageText = this.add.text(150, 70, "Next/1 YR", { color: "#000000", fontSize: "32px" })
            .setInteractive({ useHandCursor: true });

        this.scale = this.add.image(95, 165, 'scale').setDisplaySize(60, 60);
        this.weightText = this.add.text(250, 140, "2 LB", { color: "#000000", fontSize: "32px" });

        this.nameText = this.add.text(70, 200, "NAME", { color: "#000000", fontSize: "55px" });
        this.name = this.add.text(200, 250, "GABE", { color: "#000000", fontSize: "55px" });

        /* listeners */
        this.ageText.on('pointerdown', () => {
            this.scene.switch('sexGenerationScreen');
        });
    }
}

class SexGenerationScreen extends Phaser.Scene {
    constructor() {
        super({ key: "sexGenerationScreen" });
    }

    preload() {
    }

    create() {
        this.cameras.main.setBackgroundColor('#FFFFFF');
        this.scene.moveDown();

        this.sexText = this.add.text(60, 60, "Next/SEX", { color: "#000000", fontSize: "55px" })
            .setInteractive({ useHandCursor: true });
        this.sex = this.add.text(220, 130, "BOI", { color: "#000000", fontSize: "55px" });

        this.genText = this.add.text(60, 200, "GEN.", { color: "#000000", fontSize: "55px" });
        this.gen = this.add.text(250, 270, "Z", { color: "#000000", fontSize: "55px" });

        /* listeners */
        this.sexText.on('pointerdown', () => {
            this.scene.switch('hungHapScreen');
        });
    }
}
