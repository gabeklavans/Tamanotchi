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