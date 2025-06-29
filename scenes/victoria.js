export default class Game extends Phaser.Scene {
    constructor() {
        super({ key: 'victoria' });
    }

    preload() {
    }

    create(data) {
        const total = data.totalItems || 0;

        this.add.rectangle(0, 0, this.scale.width, this.scale.height, 0x4B0082).setOrigin(0);

        this.add.text(this.scale.width / 2, this.scale.height / 2, `Victoria\nTotal de cruces recolectadas: ${total}`, {
            fontFamily: '"Press Start 2P"',
            fontSize: '30px',
            color: '#FFFFFF',
            align: 'center'
        }).setOrigin(0.5);

        this.add.text(this.scale.width / 2, this.scale.height / 2 + 80, 
'Presiona R para reiniciar', {
            fontFamily: '"Press Start 2P"',
            fontSize: '24px',
            fill: '#FFFFFF',
            align: 'center'
        }).setOrigin(0.5);

        this.teclaR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(this.teclaR)) {
            this.scene.start('laberinto1', { totalItems: 0 });
        }
    }
}
