import laberinto1 from './scenes/laberinto1.js';
import laberinto2 from './scenes/laberinto2.js';
import laberinto3 from './scenes/laberinto3.js';
import victoria from './scenes/victoria.js';


var config = {
  type: Phaser.AUTO,
  width: 1080,
  height: 720,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    min: {
      width: 1500,
      height: 1100,
    },
    max: {
      width: 1600,
      height: 1200,
    },
  },
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
      debug: false,
    },
  },
  // Listado de todas las escenas del juego, en orden
  scene: [laberinto2, laberinto3, victoria],
};

var game = new Phaser.Game(config);