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

function preload ()
{
    this.load.image('background', 'assets/Tama_Frame.png');
    this.load.image('flush', 'assets/toilet.png');
    this.load.image('flushies', 'assets/flushies.png');
    this.load.image('poop', 'assets/poo.png');
    this.load.spritesheet('sprite', 'assets/mametchi sheet.png', {frameWidth: 64, frameHeight:65});
}

function create ()
{
    this.physics.world.setBoundsCollision(true, true, true, true);

    this.bg = this.add.image(200, 200, 'background').setDepth(1);
    tama = this.physics.add.sprite(200, 200, 'sprite');

    tama.on('animationupdate', function() {
        this.setRandomPosition(90, 90, 220, 220);
    });

    poop = this.physics.add.sprite(200, 200, 'poop').setRandomPosition(90, 90, 220, 220).setDisplaySize(50,50);

    this.physics.world.on("worldbounds", function() {
        console.log("WORLD COLLIDED");
        tama.setVelocityX(0);
        tama.setPosition(200);
        tama.anims.resume();
        poop.destroy();
    });

    this.anims.create({
        key: 'idle',
        frames: this.anims.generateFrameNumbers('sprite'),
        frameRate: (1/3),
        repeat: -1
    });

    tama.anims.play('idle', true);

    let flush = this.add.image(30,370, 'flush')
        .setDepth(2)
        .setDisplaySize(30,30)
        .setInteractive({ useHandCursor: true })
    flush.on('pointerdown', () => { 
        tama.anims.pause();
        let flushies = this.physics.add.sprite(28, 200, 'flushies')
            .setCollideWorldBounds(true);
        flushies.body.onWorldBounds = true;
        flushies.body.immovable = true;
        this.physics.add.collider(tama, flushies);
        this.physics.add.collider(poop, flushies);
        this.physics.moveTo(flushies, 200, 200, 100);

        
        var term = "wow"//document.getElementById("thing").value;
        var url = 'http://localhost:6969/index?term=' + term;
        // Now send a request to your Node program
        fetch(url).then(function(res) {
        // Res will be a Response object.
        // Use res.text() or res.json() to get the information that the Node program sent.
        console.log(res.text());
        }); 
    });
}

function update () {

}