class EatCutscene extends Phaser.Scene {
    constructor() {
        super({ key: 'eatCutscene' });
    }

    preload() {

    }

    create() {
        /* import UI scene */
        const sceneUI = this.scene.get('UI');

        this.cameras.main.setBackgroundColor('#FFFFFF');
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