class Main extends Phaser.Scene {
    constructor() {
        super("Main");
        this.count = 0;
    }

    preload() {
        this.load.image('background', 'assets/Tama_Frame.png');
        this.load.image('flush', 'assets/toilet.png');
        this.load.image('flushies', 'assets/flushies.png');
        this.load.image('poop', 'assets/poo.png');
        this.load.image('pixel', 'assets/black.png');
        this.load.image('gun', 'assets/gun.png');
    }

    create() {
        this.bg = this.add.image(200, 200, 'background').setDepth(1);
        this.info = this.add.text("Count: 0");
    }

    update() {
        this.count ++;
        this.info.setText("Count : " + this.count);
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
        scene: [ Main ],
        transparent: true
}

initialize(config);

function initialize (config) {
    const game = new Phaser.Game(config);
}
