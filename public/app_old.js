// 1. Create the button
var button = document.createElement("button");
button.innerHTML = "Retrieve my number from database";

// 2. Append somewhere
var body = document.getElementsByTagName("body")[0];
body.appendChild(button);

// 3. Add event handler
button.addEventListener("click", getTestData);

function createTestData() {
    var testBody = {
        "number": "+14074084325"
    }

    fetch('http://localhost:6969/mongo', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(testBody)
    }).then(function (res) {
        res.text().then(function (text) {
            console.log(text);
        });
    });
}

function getTestData() {
    var num = '5c3ef210005c3f570cc7ba56';
    fetch('http://localhost:6969/mongo/' + num, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    }).then(function (res) {
        return res.json();
    }).then(doc => {
        alert("JK it won't be THAT easy to get my digits ;) But here's the game save ID: " + doc._id);
    });
}

/**
 * Returns a Date object of the new time
 */
function getNextPoopTime() {
    let date = moment();
    let amount = Math.floor(Math.random() * 10);
    console.log("Made next poop time " + amount + "min from now");
    date.add(amount, 'm');
    return date.toDate();
}

/**
 * Sends an SMS text using Twilio
 */
function sendSMS(kind = "test data worked!") {
    var url = 'http://localhost:6969/twilio?kind=' + kind;
    fetch(url).then(res => {
        return res.text();
    }).then(data => {
        console.log(data);
    });
}

class UI extends Phaser.Scene {
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
        })

        this.pixel.on('pointerdown', () => {
            this.events.emit('empowered');
        });
    }
}

class Main extends Phaser.Scene {
    constructor() {
        super({ key: "Main" });
        this.gameStartTime = new Date();
        this.nextPoopTime = getNextPoopTime();
    }

    flush() {
        this.tama.anims.pause();
        this.flushies.setVisible(true);
        this.physics.moveTo(this.flushies, 200, 200, 100);

        //sendSMS("BOI");
    }

    preload() {
        this.load.image('flushies', 'assets/flushies.png');
        this.load.image('poop', 'assets/poo.png');
        this.load.image('gun', 'assets/gun.png');
        this.load.spritesheet('sprite', 'assets/mametchi sheet.png', { frameWidth: 64, frameHeight: 65 });
    }

    create() {
        /* import UI scene */
        //this.scene.add('UI', UI, true);

        const sceneUI = this.scene.get('UI');

        /* enable the right boundary to detect collisions */
        this.physics.world.setBoundsCollision(false, true, false, false);

        /* add base objects to scene */
        this.tama = this.physics.add.sprite(200, 200, 'sprite');
        this.poops = this.physics.add.group();


        /* add remaining objects */
        this.flushies = this.physics.add.sprite(28, 200, 'flushies').setCollideWorldBounds(true).setVisible(false);
        this.flushies.body.immovable = true;
        this.flushies.body.onWorldBounds = true;
        this.gun = this.add.image(1, 1, 'gun').setDisplaySize(40, 30).setVisible(false);

        //move tama around on each animation frame
        this.tama.on('animationupdate', function () {
            this.setRandomPosition(90, 90, 220, 220);
        });

        /* add listeners */
        //check for flushies end animation
        this.physics.world.on("worldbounds", () => {
            console.log("WORLD COLLIDED");
            this.tama.setVelocityX(0);
            this.tama.setPosition(200);
            this.tama.anims.resume();
            this.poops.clear(true, true);
            this.flushies.setVisible(false).setPosition(28, 200);
            sceneUI.enableButtons();
        });
        sceneUI.events.on('empowered', () => {
            this.empower();
        });

        /* colliders */
        this.physics.add.collider(this.tama, this.flushies);
        this.physics.add.collider(this.poops, this.flushies);

        /* create animations */

        this.anims.create({
            key: 'idle',
            frames: this.anims.generateFrameNumbers('sprite'),
            frameRate: (1 / 3),
            repeat: -1
        });

        this.anims.create({
            key: 'eating',
            frames: this.anims.generateFrameNumbers('sprite'),
            frameRate: (2),
            repeat: 3
        });

        /* temp */

        this.tama.anims.play('idle', true);

        //debug
        this.progress = this.add.text(0, 0, 'Time (ms): 0', { color: '#00ff00' }).setDepth(3);

        var poop = this.poops.create(200, 200, 'poop');
        poop.setRandomPosition(90, 90, 220, 220).setDisplaySize(50, 50);
        //this.poops.add(this.poop);
    }

    update() {
        var currentTime = new Date();
        if (this.nextPoopTime.getTime() - currentTime.getTime() <= 0) {
            //console.log(currentTime.getTime() - gameStartTime.getTime());
            var poop = this.poops.create(200, 200, 'poop');
            poop.setRandomPosition(90, 90, 220, 220).setDisplaySize(50, 50);
            //this.poops.add(poop);
            this.nextPoopTime = getNextPoopTime();
        }

        if (this.gun !== undefined) {
            this.gun.setPosition(this.tama.x - 28, this.tama.y - 5);
        }

        //debug
        this.progress.setText('Time (ms): ' + (currentTime.getTime() - this.gameStartTime.getTime()));
    }

    empower() {
        this.gun.setVisible(true);
        alert("Will gave u a gun...");
    }
}

class EatCutscene extends Phaser.Scene {
    constructor() {
        super({ key: 'eatCutscene' });
    }

    preload() {

    }

    create() {
        /* import UI scene */
        const sceneUI = this.scene.get('UI');

        this.cameras.main.setBackgroundColor('#FFFFFF')
        this.scene.moveDown();

        /* add objects + animations */
        this.tama = this.physics.add.sprite(250, 200, 'sprite');
        this.burger = this.add.image(150, 200, 'burger').setDisplaySize(30, 30);

        this.tama.anims.play('eating', true);

        /* listeners */
        this.tama.on('animationcomplete', () => {
            this.scene.remove('eatCutscene');
            sceneUI.enableButtons();
        });

        this.tama.on('animationrepeat', () => {
            let current = this.burger.alpha;
            this.burger.setAlpha(current - 0.3);
        });
    }
}

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

const config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 400,
    height: 400,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: [Main, UI],
    transparent: true
};

function initializeGame(config, data = "DEFAULT") {
    console.log(data);

    var game = new Phaser.Game(config);
};

initializeGame(config);