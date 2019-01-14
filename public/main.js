//import 'phaser';

var config = {
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
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    transparent: true
};

var game = new Phaser.Game(config);

var nextPoop = 3000;

var gameStartTime = new Date();
var currentTime;

function preload ()
{
    this.load.image('background', 'assets/Tama_Frame.png');
    this.load.image('flush', 'assets/toilet.png');
    this.load.image('flushies', 'assets/flushies.png');
    this.load.image('poop', 'assets/poo.png');
    this.load.image('pixel', 'assets/black.png');
    this.load.image('gun', 'assets/gun.png');
    this.load.spritesheet('sprite', 'assets/mametchi sheet.png', {frameWidth: 64, frameHeight:65});
}

function create ()
{
    /* enable the right boundary to detect collisions */
    this.physics.world.setBoundsCollision(false, true, false, false);

    /* add interface */
    this.bg = this.add.image(200, 200, 'background').setDepth(1);
    buttons = this.add.group();
    flush = this.add.image(30,370, 'flush')
        .setDepth(2)
        .setDisplaySize(30,30)
    buttons.add(flush);
    pixel = this.add.image(20,20, 'pixel').setDisplaySize(1,1).setDepth(2).setInteractive({useHandCursor: true});

    enableButtons();

    /* add base objects to scene */
    tama = this.physics.add.sprite(200, 200, 'sprite');
    poops = this.physics.add.group();
    gun = this.add.image(1,1,'gun').setDisplaySize(40,30).setVisible(false);

    /* define event listeners */

    //move tama around on each animation frame
    tama.on('animationupdate', function() {
        this.setRandomPosition(90, 90, 220, 220);
    });
    //check for flushies end animation
    this.physics.world.on("worldbounds", function() {
        console.log("WORLD COLLIDED");
        tama.setVelocityX(0);
        tama.setPosition(200);
        tama.anims.resume();
        poop.destroy();
        flushies.destroy();
        enableButtons();
    });
    //flush button
    flush.on('pointerdown', () => { 
        disableButtons();
        tama.anims.pause();
        flushies = this.physics.add.sprite(28, 200, 'flushies')
            .setCollideWorldBounds(true);
        flushies.body.onWorldBounds = true;
        flushies.body.immovable = true;
        this.physics.add.collider(tama, flushies);
        this.physics.add.collider(poops, flushies);
        this.physics.moveTo(flushies, 200, 200, 100);

        //sendSMS();
    });
    //be careful with that...
    pixel.on('pointerdown', function() {
        gun.setVisible(true);
        console.log("u got a gun...");
    });


    /* temp placement */

    this.anims.create({
        key: 'idle',
        frames: this.anims.generateFrameNumbers('sprite'),
        frameRate: (1/3),
        repeat: -1
    });

    tama.anims.play('idle', true);

    //debug
    progress = this.add.text(0, 0, 'Time (ms): 0', { color: '#00ff00' });

    let poop = this.physics.add.sprite(200, 200, 'poop').setRandomPosition(90, 90, 220, 220).setDisplaySize(50,50);
    poops.add(poop);
}

function update () {
    currentTime = new Date();
    /*
    if (currentTime.getTime() - gameStartTime.getTime() >= nextPoop) {
        console.log(currentTime.getTime() - gameStartTime.getTime());
        let poop = this.physics.add.sprite(200, 200, 'poop').setRandomPosition(90, 90, 220, 220).setDisplaySize(50,50);
        poops.add(poop);
        nextPoop = 5000
    } */

    if(gun !== undefined) {
        gun.setPosition(tama.x-28, tama.y-5);
    }

    //debug
    progress.setText('Time (ms): ' + (currentTime.getTime() - gameStartTime.getTime()));
}

function sendSMS(term = "test data worked!") {
    // term = document.getElementById("thing").value;
    var url = 'http://localhost:6969/index?term=' + term;
    // Now send a request to your Node program
    fetch(url).then(function(res) {
        // Res will be a Response object.
        // Use res.text() or res.json() to get the information that the Node program sent.
        console.log(res.text());
    }); 
}

function enableButtons() {
    Phaser.Actions.Call(buttons.getChildren(), function(button) {
        button.setInteractive({ useHandCursor: true });
    }, this);
}

function disableButtons() {
     Phaser.Actions.Call(buttons.getChildren(), function(button) {
        button.disableInteractive();
    }, this);
}