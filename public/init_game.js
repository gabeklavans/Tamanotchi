import UI from './scenes/UI.js'
import Main from './scenes/Main.js'

const config = {
    type: Phaser.AUTO,
    parent: 'phaser-canvas',
    width: 400,
    height: 400,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    // Scenes are prioritized in reverse order
    scene: [Main, UI],
    transparent: true
};

const game = new Phaser.Game(config);