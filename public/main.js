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
            this.scene.add('ageWeightNameScreen', AgeWeightNameScreen, false);
            this.scene.add('sexGenerationScreen', SexGenerationScreen, false);
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
        this.tama = this.physics.add.sprite(200, 200, 'sprite').setDisplaySize(90,90);
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