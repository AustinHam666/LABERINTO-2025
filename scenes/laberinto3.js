export default class laberinto3 extends Phaser.Scene {
    constructor() {
        super('laberinto3');
    }

    init(data) {
        this.totalItems = data.totalItems || 0;
    }

    preload() {
        this.load.image('tilemap', 'public/assets/tilemap/texture.png');
        this.load.tilemapTiledJSON('mapa3', 'public/assets/tilemap/mapa3.json');
        this.load.image('fantasma', 'public/assets/objetos/fantasma.png');
        this.load.image('cruz', 'public/assets/objetos/cruz.png');
        this.load.image('portal', 'public/assets/objetos/portal.png');
        this.load.image('cruzmadera', 'public/assets/objetos/cruzmadera.png');
    }

    create() {
        const map = this.make.tilemap({ key: 'mapa3' });
        //const tileset = map.addTilesetImage('paredlaberinto3', 'tilemap');
        const tileset = map.addTilesetImage('fondolaberinto', 'tilemap');
        const layer = map.createLayer('plataforma', tileset, 0, 0);
        layer.setCollisionByProperty({ colision: true });

        const spawnPoint = map.findObject('objetos', obj => obj.name === 'Player');
        this.fantasma = this.physics.add.sprite(spawnPoint.x, spawnPoint.y, 'fantasma');
        this.fantasma.setCollideWorldBounds(false);
        this.physics.add.collider(this.fantasma, layer);

        this.physics.world.setBounds(0, 0, 3840, 800);
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.startFollow(this.fantasma);
        this.cameras.main.setZoom(3);

        this.Cruces = this.physics.add.group();
        const objetosCruces = map.getObjectLayer('objetos').objects.filter(obj => obj.name === 'cruz');
        objetosCruces.forEach(obj => {
            this.Cruces.create(obj.x, obj.y - obj.height, 'cruz');
        });

        this.itemsRecolectados = 0;

        this.physics.add.overlap(this.fantasma, this.Cruces, (fantasma, cruz) => {
            cruz.destroy();
            this.itemsRecolectados++;
            this.itemText.setText(`Items ${this.itemsRecolectados}/5`);
        }, null, this);

        this.mensajeTexto = this.add.text(30, 80, '', {
            fontFamily: '"Press Start 2P"',
            fontSize: '24px',
            fill: '#FFD700'
        });

        this.enemigos = this.physics.add.group();
        this.physics.add.collider(this.enemigos, layer);

        map.getObjectLayer('objetos').objects.forEach(obj => {
            if (obj.name === 'enemigo') {
                const enemigo = this.enemigos.create(obj.x, obj.y - obj.height, 'cruzmadera');
                enemigo.setCollideWorldBounds(true);
                enemigo.body.setAllowGravity(false);
                enemigo.setVelocityY(100);
                enemigo.body.setBounce(1, 1);
                enemigo.setScale(1.5);
            }
        });

        this.physics.add.collider(this.enemigos, layer, (enemigo, tile) => {
            enemigo.body.velocity.y *= -1;
        });

        this.physics.add.overlap(this.fantasma, this.enemigos, () => {
            const spawnPoint = map.findObject('objetos', obj => obj.name === 'player');
            this.fantasma.setPosition(spawnPoint.x, spawnPoint.y);
        }, null, this);

        const portalObj = map.findObject('objetos', obj => obj.name === 'portal');
        this.portal = this.physics.add.sprite(portalObj.x, portalObj.y - portalObj.height, 'portal');
        this.portal.setImmovable(true);
        this.portal.body.setAllowGravity(false);

        this.physics.add.overlap(this.fantasma, this.portal, () => {
            if (this.itemsRecolectados >= 5) {
                this.scene.start('victoria', {
                totalItems: this.totalItems + this.itemsRecolectados
                });
            } else {
                this.mensajeTexto.setText('Intenta recolectar 5 cruces');
                this.time.delayedCall(2000, () => {
                    this.mensajeTexto.setText('');
                });
            }
        }, null, this);

        this.itemText = this.add.text(30, 30, 'Cruces 0/5', {
            fontFamily: '"Press Start 2P"',
            fontSize: '36px',
            fill: '#FFFFFF'
        });

        this.uiCamera = this.cameras.add(0, 0, this.game.config.width, this.game.config.height);
        this.uiCamera.ignore([layer, this.fantasma]);
        this.cameras.main.ignore([this.itemText]);
        this.uiCamera.ignore(this.Cruces.getChildren());
        this.cameras.main.ignore([this.itemText, this.mensajeTexto]);

        this.kKey = this.input.keyboard.addKey('K');

        this.cursors = this.input.keyboard.createCursorKeys();
    }


    update() {
        const speed = 300;
        this.fantasma.body.setVelocity(0);

        if (Phaser.Input.Keyboard.JustDown(this.kKey)) {
    this.scene.start('victoria');
}

        if (this.cursors.left.isDown) {
            this.fantasma.body.setVelocityX(-speed);
        } else if (this.cursors.right.isDown) {
            this.fantasma.body.setVelocityX(speed);
        }

        if (this.cursors.up.isDown) {
            this.fantasma.body.setVelocityY(-speed);
        } else if (this.cursors.down.isDown) {
            this.fantasma.body.setVelocityY(speed);
        }
    }
}