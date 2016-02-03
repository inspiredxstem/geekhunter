var TopDownGame = TopDownGame || {};

//loading the game assets
TopDownGame.Preload = function(){};

TopDownGame.Preload.prototype = {
  preload: function() {
    //show loading screen
    this.preloadBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'preloadbar');
    this.preloadBar.anchor.setTo(0.5);

    this.load.setPreloadSprite(this.preloadBar);

    //load game assets
    this.load.tilemap('level0', 'assets/tilemaps/level0.json', null, Phaser.Tilemap.TILED_JSON);
    this.load.tilemap('level1', 'assets/tilemaps/level1.json', null, Phaser.Tilemap.TILED_JSON);
    this.load.tilemap('level2', 'assets/tilemaps/level2.json', null, Phaser.Tilemap.TILED_JSON);
    this.load.tilemap('level3', 'assets/tilemaps/level3.json', null, Phaser.Tilemap.TILED_JSON);
    this.load.image('gameTiles', 'assets/images/tiles.png');
    this.load.image('dungeontileset', 'assets/images/dungeontileset.png');
    this.load.image('greencup', 'assets/images/greencup.png');
    this.load.image('redcup', 'assets/images/coffeecup-red.png')
    this.load.image('bluecup', 'assets/images/bluecup.png');
    this.load.spritesheet('player', 'assets/images/nerdguy.png', 33, 45, 12);
    this.load.image('browndoor', 'assets/images/browndoor.png');
    this.load.image('computer', 'assets/images/computer.png');
    this.load.image('brainworm', 'assets/images/brainworm.png');
    
  },
  create: function() {
    this.state.start('Game');
  }
};
