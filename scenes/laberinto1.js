export default class laberinto1 extends Phaser.Scene {
    constructor() {
        super('laberinto1');
    }

    init() {
        this.totalItems = 0;  // No hay datos que llegar, iniciamos en 0
    }


    preload() {
        // mapa y assets
        this.load.image('tilemap', 'public/assets/tilemap/texture.png');
        this.load.tilemapTiledJSON('mapa1', 'public/assets/tilemap/mapa1.json');
        this.load.image('fantasma', 'public/assets/objetos/fantasma.png');
        this.load.image('cruz', 'public/assets/objetos/cruz.png');
        this.load.image('portal', 'public/assets/objetos/portal.png');
    }

    create() {
        // Crear el mapa desde el archivo JSON
        const map = this.make.tilemap({ key: 'mapa1' });

        // Asociar el nombre del tileset (de Tiled) con el archivo de imagen
        const tileset = map.addTilesetImage('asset fondo laberinto', 'tilemap');
        const tileset2 = map.addTilesetImage('asset pared laberinto', 'tilemap');

        // Crear la capa llamada "plataforma" 
        const layer = map.createLayer('plataforma', tileset, 0, 0); 

        // Activar colisión en los tiles con la propiedad "colision: true"
        layer.setCollisionByProperty({ colision: true });

        // Buscar el objeto "Jugador" desde la capa de objetos
        const spawnPoint = map.findObject('objetos', obj => obj.name === 'player');


// Activa el renderizado de debug para Arcade Physics
/*this.physics.world.createDebugGraphic();
this.physics.world.drawDebug = false;

// Opcional: haz que la capa de colisiones también muestre debug
layer.renderDebug(this.add.graphics(), {
    tileColor: null, // Color de tiles sin colisión
    collidingTileColor: new Phaser.Display.Color(243, 134, 48, 200), // Color de tiles con colisión
    faceColor: new Phaser.Display.Color(10, 24, 7, 255) // Color de las caras de colisión
});*/
// ...existing code...

        // Crear sprite del fantasma
        this.fantasma = this.physics.add.sprite(spawnPoint.x, spawnPoint.y, 'fantasma');
        this.fantasma.setCollideWorldBounds(false);

        // Hacer que el fantasma colisione con la capa
        this.physics.add.collider(this.fantasma, layer);

        // Agrando el rango de pantalla al mapa creado en tiled
        this.physics.world.setBounds(0, 0, 3840, 800);

        // Cámara que sigue al fantasma
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels); // la camara no se sale de los limites del mapa
        this.cameras.main.startFollow(this.fantasma);
        this.cameras.main.setZoom(3);

        this.Cruces = this.physics.add.group();
        const objetosCruces = map.getObjectLayer('objetos').objects.filter(obj => obj.name === 'cruz');

        objetosCruces.forEach(obj => {
            this.Cruces.create(obj.x, obj.y - obj.height, 'cruz'); // Ajuste Y correcto según Tiled
        });

        // recoleccion de items !!
        this.itemsRecolectados = 0;

        this.physics.add.overlap(this.fantasma, this.Cruces, (fantasma, cruz) => {
        cruz.destroy();
        this.itemsRecolectados++;
        this.itemText.setText(`Items ${this.itemsRecolectados}/5`);
        }, null, this);


        // texto por si no llega a recolectar todos los items
        this.mensajeTexto = this.add.text(30, 80, '', {
            fontFamily: '"Press Start 2P"',
            fontSize: '24px',
            fill: '#FFD700'
        });

        const portalObj = map.findObject('objetos', obj => obj.name === 'portal');
        this.portal = this.physics.add.sprite(portalObj.x, portalObj.y - portalObj.height, 'portal');
        this.portal.setImmovable(true);
        this.portal.body.setAllowGravity(false);

        this.physics.add.overlap(this.fantasma, this.portal, () => {
            if (this.itemsRecolectados >= 5) {
                this.scene.start('laberinto2', {
                    totalItems: this.itemsRecolectados
                });
            } else {
                this.mensajeTexto.setText('Intenta recolectar 5 cruces');
                this.time.delayedCall(2000, () => {
                    this.mensajeTexto.setText('');
                });
            }
        }, null, this);

        // Creo el texto de los ítems
        this.itemText = this.add.text(30, 30, 'Cruces 0/5', {
            fontFamily: '"Press Start 2P"',
            fontSize: '36px',
            fill: '#FFFFFF'
        });

        // Crear una segunda cámara solo para la UI (HUD del juego)
        this.uiCamera = this.cameras.add(0, 0, this.game.config.width, this.game.config.height);
        this.uiCamera.ignore([layer, this.fantasma]); // Ignora el mundo del juego
        this.cameras.main.ignore([this.itemText]); // Ignora el texto en la cámara con zoom
        this.uiCamera.ignore(this.Cruces.getChildren()); // Ignora todas las cruces
        this.uiCamera.ignore([layer, this.fantasma]); // cámara del HUD ignora el mundo
        this.cameras.main.ignore([this.itemText, this.mensajeTexto]); // cámara principal ignora el texto

        // Controles del teclado
        this.cursors = this.input.keyboard.createCursorKeys();
    }

    update() {
        const speed = 300;
        this.fantasma.body.setVelocity(0);

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