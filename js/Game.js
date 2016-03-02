/*global Phaser*/
var TopDownGame = TopDownGame || {};

//title screen
TopDownGame.Game = function () {};

TopDownGame.Game.prototype = {
  create: function() {
    this.changeLevel('level0');

    //move player with cursor keys
    this.game.cursors = this.cursors = this.game.input.keyboard.createCursorKeys();
    this.game.globals = this;
    

  },
  changeLevel: function(levelString) {
    if (!levelString) {
      levelString = 'level0';
    }
    // switch music
    if (this.music) {
      this.music.stop();
    }
    this.music = this.add.audio('megalovania');
    this.music.play();

    this.cleanup();

    this.map = this.game.add.tilemap(levelString);

    //the first parameter is the tileset name as specified in Tiled, the second is the key to the asset
    this.map.addTilesetImage('tiles', 'gameTiles');
    this.map.addTilesetImage('dungeontileset', 'dungeontileset');

    //create layer
    this.backgroundlayer = this.map.createLayer('backgroundLayer');
    this.blockedLayer = this.map.createLayer('blockedLayer');

    //collision on blockedLayer
    this.map.setCollisionBetween(1, 10000, true, 'blockedLayer');

    //resizes the game world to match the layer dimensions
    
    this.world.width = 200;
    this.world.height = 200;
    console.log(this.world);
    //this.backgroundlayer.resizeWorld();
    
    this.createItems();
    this.createEnemies();
    this.createDoors();
    
    //create player
    var result = this.findObjectsByType('playerStart', this.map, 'objectsLayer')
    this.player = new Player(this.game, result[0].x, result[0].y);
    this.game.add.existing(this.player);

    //the camera will follow the player in the world
    this.game.camera.follow(this.player);
  },
  
  cleanup: function() {
    // cleanup
    if (this.items) {
      this.items.forEach(function (item) { item.destroy(); });
    }
    if (this.enemies) {
      this.enemies.forEach(function (enemy) { enemy.destroy(); });
    }
    if (this.doors) {
      this.doors.forEach(function (door) { door.destroy(); });
    }
    if (this.map) {
      this.backgroundlayer.destroy();
      this.blockedLayer.destroy();
      this.map.destroy();
    }
    // if (this.player) {
    //   this.player.destroy();
    // }
  },
  
  createEnemies: function() {
    //create enemies
    this.enemies = this.game.add.group();
    this.enemies.enableBody = true;
    var result = this.findObjectsByType('enemy', this.map, 'objectsLayer');

    result.forEach(function(element){
      // this.createFromTiledObject(element, this.enemies);
      this.createEnemy(element, this.enemies);
    }, this);
  },
  createItems: function() {
    //create items
    this.items = this.game.add.group();
    this.items.enableBody = true;
    var item;    
    var result = this.findObjectsByType('item', this.map, 'objectsLayer');
    result.forEach(function(element){
      this.createFromTiledObject(element, this.items);
    }, this);
  },
  createDoors: function() {
    //create doors
    this.doors = this.game.add.group();
    this.doors.enableBody = true;
    var result = this.findObjectsByType('door', this.map, 'objectsLayer');

    result.forEach(function(element){
      this.createFromTiledObject(element, this.doors);
    }, this);
  },

  //find objects in a Tiled layer that containt a property called "type" equal to a certain value
  findObjectsByType: function(type, map, layer) {
    var result = new Array();
    map.objects[layer].forEach(function(element){
      if(element.properties.type === type) {
        //Phaser uses top left, Tiled bottom left so we have to adjust
        //also keep in mind that the cup images are a bit smaller than the tile which is 16x16
        //so they might not be placed in the exact position as in Tiled
        element.y -= map.tileHeight;
        result.push(element);
      }
    });
    return result;
  },
  //create a sprite from an object
  createFromTiledObject: function(element, group) {
    var sprite = group.create(element.x, element.y, element.properties.sprite);

    //copy all properties to the sprite
    Object.keys(element.properties).forEach(function(key){
      sprite[key] = element.properties[key];
    });
  },
  createEnemy: function(element, group) {
    var sprite = new Enemy(this.game, element.x, element.y, element.properties);
    group.add(sprite);
  },
  update: function() {
    //collision (player)
    this.game.physics.arcade.collide(this.player, this.blockedLayer);
    this.game.physics.arcade.overlap(this.player, this.items, this.collect, null, this);
    this.game.physics.arcade.overlap(this.player, this.doors, this.enterDoor, null, this);

    // collision (enemy)
    this.game.physics.arcade.collide(this.enemies, this.blockedLayer);
    this.game.physics.arcade.overlap(this.player, this.enemies, this.startBattle, null, this);
    
    // For debugging: immediately start battle with first enemy
    this.startBattle(this.player, this.enemies.getFirstAlive());
  },
  collect: function(player, collectable) {
    console.log('yummy!');

    //remove sprite
    collectable.destroy();
  },
  startBattle: function(player, enemy) {
    // temporary! just destroy the enemy
    // enemy.destroy();
    this.cleanup();
    this.game.state.start('Battle');
    this.currentEnemy = enemy;
  },
  enterDoor: function(player, door) {
    console.log('entering door that will take you to '+door.targetTilemap+' on x:'+door.targetX+' and y:'+door.targetY);
    this.changeLevel(door.targetTilemap);
  }
};
