// 1. Create the button
var button = document.createElement("button");
button.innerHTML = "Retrieve my number from database";

// 2. Append somewhere
var body = document.getElementsByTagName("body")[0];
body.appendChild(button);

// 3. Add event handler
button.addEventListener ("click", getTestData);

function createTestData () {
    var testBody = {
        "number" : "+14074084325"
    }

    fetch('http://localhost:6969/mongo', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(testBody)
    }).then(function(res) {
        res.text().then(function(text) {
            console.log(text);
        });
    });
}

function getTestData() {
    var num = '5c3ef210005c3f570cc7ba56';
    fetch('http://localhost:6969/mongo/'+num, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    }).then( function(res) {
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
        super ({key: "UI", active: true});
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
    }

    create() {
        /* import main loop scene*/
        const sceneMain = this.scene.get('Main');

        /* add interface */
        this.bg = this.add.image(200, 200, 'background').setDepth(1);
        this.buttons = this.add.group();
        this.flushButton = this.add.image(30, 370, 'flushButton')
            .setDepth(2)
            .setDisplaySize(30, 30);
        this.buttons.add(this.flushButton);
        this.pixel = this.add.image(20, 20, 'pixel').setDisplaySize(1, 1).setDepth(2).setInteractive({ useHandCursor: true });
 
        this.enableButtons();

        /* listeners for UI */
        this.flushButton.on('pointerdown', () => {
            this.disableButtons();
            sceneMain.flush();
        });

        this.pixel.on('pointerdown', sceneMain.empower);
    }
}

class Main extends Phaser.Scene {
    constructor() {
        super({key: "Main"});
        this.gameStartTime = new Date();
        this.nextPoopTime = getNextPoopTime();
    }

    flush() {
        this.tama.anims.pause();
        this.flushies = this.physics.add.sprite(28, 200, 'flushies')
            .setCollideWorldBounds(true);
        this.flushies.body.onWorldBounds = true;
        this.flushies.body.immovable = true;
        this.physics.add.collider(this.tama, this.flushies);
        this.physics.add.collider(this.poops, this.flushies);
        this.physics.moveTo(this.flushies, 200, 200, 100);

        //sendSMS("BOI");
    }

    empower() {
        this.gun.setVisible(true);
        console.log("u got a gun...");
    }

    preload() {
        this.load.image('flushies', 'assets/flushies.png');
        this.load.image('poop', 'assets/poo.png');
        this.load.image('gun', 'assets/gun.png');
        this.load.spritesheet('sprite', 'assets/mametchi sheet.png', { frameWidth: 64, frameHeight: 65 });
    }

    create() {
        /* import UI scene */
        const sceneUI = this.scene.get('UI');

        /* enable the right boundary to detect collisions */
        this.physics.world.setBoundsCollision(false, true, false, false);

        /* add base objects to scene */
        this.tama = this.physics.add.sprite(200, 200, 'sprite');
        this.poops = this.physics.add.group();
        this.gun = this.add.image(1, 1, 'gun').setDisplaySize(40, 30).setVisible(false);

        /* define event listeners */

        //move tama around on each animation frame
        this.tama.on('animationupdate', function () {
            this.setRandomPosition(90, 90, 220, 220);
        });
        //check for flushies end animation
        this.physics.world.on("worldbounds", () =>  {
            console.log("WORLD COLLIDED");
            this.tama.setVelocityX(0);
            this.tama.setPosition(200);
            this.tama.anims.resume();
            this.poops.clear(true, true);
            this.flushies.destroy();
            sceneUI.enableButtons();
        });

        /* temp placement */

        this.anims.create({
            key: 'idle',
            frames: this.anims.generateFrameNumbers('sprite'),
            frameRate: (1 / 3),
            repeat: -1
        });

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
    scene: [ Main, UI ],
    transparent: true
};

function initializeGame(config, data = "DEFAULT") {
    console.log(data);

    var game = new Phaser.Game(config);
};

initializeGame(config);