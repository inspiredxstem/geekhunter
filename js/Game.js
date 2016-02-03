var TopDownGame = TopDownGame || {};

//title screen
TopDownGame.Game = function () {};

TopDownGame.Game.prototype = {
  create: function() {
    this.changeLevel('level0');

    //move player with cursor keys
    this.cursors = this.game.input.keyboard.createCursorKeys();

  },
  changeLevel: function(levelString) {
    if (!levelString) {
      levelString = 'level0';
    }
    
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
    if (this.player) {
      this.player.destroy();
    }

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
    this.backgroundlayer.resizeWorld();
    
    this.createItems();
    this.createEnemies();
    this.createDoors();
    
    
    //create player
    var result = this.findObjectsByType('playerStart', this.map, 'objectsLayer')
    this.player = this.game.add.sprite(result[0].x, result[0].y, 'player');
    this.player.frame = 4; // set initial frame

    var animationFPS = 8;
    this.player.animations.add('up', [0, 1, 2], animationFPS);
    this.player.animations.add('right', [3, 4, 5], animationFPS);
    this.player.animations.add('down', [6, 7, 8], animationFPS);
    this.player.animations.add('left', [9, 10, 11], animationFPS);
    
    this.game.physics.arcade.enable(this.player);

    //the camera will follow the player in the world
    this.game.camera.follow(this.player);
  },
  createEnemies: function() {
    //create doors
    this.enemies = this.game.add.group();
    this.enemies.enableBody = true;
    result = this.findObjectsByType('enemy', this.map, 'objectsLayer');

    result.forEach(function(element){
      this.createFromTiledObject(element, this.enemies);
    }, this);
  },
  createItems: function() {
    //create items
    this.items = this.game.add.group();
    this.items.enableBody = true;
    var item;    
    result = this.findObjectsByType('item', this.map, 'objectsLayer');
    result.forEach(function(element){
      this.createFromTiledObject(element, this.items);
    }, this);
  },
  createDoors: function() {
    //create doors
    this.doors = this.game.add.group();
    this.doors.enableBody = true;
    result = this.findObjectsByType('door', this.map, 'objectsLayer');

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
  update: function() {
    //collision (player)
    this.game.physics.arcade.collide(this.player, this.blockedLayer);
    this.game.physics.arcade.overlap(this.player, this.items, this.collect, null, this);
    this.game.physics.arcade.overlap(this.player, this.doors, this.enterDoor, null, this);

    // collision (enemy)
    this.game.physics.arcade.collide(this.enemies, this.blockedLayer);
    this.game.physics.arcade.overlap(this.player, this.enemies, this.startBattle, null, this);
    
    var self = this;
    // enemy chasing 
    this.enemies.forEach(function (enemy) {
      if(self.player.x < enemy.x){
        enemy.body.velocity.x = -50;
      } else {
        (enemy.body.velocity.x = 50);
      } 
      if (self.player.y > enemy.y){
        enemy.body.velocity.y = 25;
      } else {
        (enemy.body.velocity.y = -25)
      }
    });
    
    
    
    
    //player movement
    
    var playerMaxSpeed = 50;
    
    // "cheat" code to go fast
    if (this.input.keyboard.isDown(Phaser.KeyCode.SHIFT)) {
      playerMaxSpeed = 1000;
    }
    
    this.player.body.velocity.x = 0;
    
    if(this.cursors.up.isDown) {
      this.playAnimation('up');
      if(this.player.body.velocity.y == 0) {
        this.player.body.velocity.y -= playerMaxSpeed;
      }
    } else if(this.cursors.down.isDown) {
      this.playAnimation('down');
      if(this.player.body.velocity.y == 0) {
        this.player.body.velocity.y += playerMaxSpeed;
      }
    } else {
      this.player.body.velocity.y = 0;
    }
    if(this.cursors.left.isDown) {
      this.playAnimation('left');
      this.player.body.velocity.x -= playerMaxSpeed;
    } else if(this.cursors.right.isDown) {
      this.playAnimation('right');
      this.player.body.velocity.x += playerMaxSpeed;
    }
  },
  collect: function(player, collectable) {
    console.log('yummy!');

    //remove sprite
    collectable.destroy();
  },
  startBattle: function(player, enemy) {
    // temporary! just destroy the enemy
    enemy.destroy();
  },
  enterDoor: function(player, door) {
    console.log('entering door that will take you to '+door.targetTilemap+' on x:'+door.targetX+' and y:'+door.targetY);
    this.changeLevel(door.targetTilemap);
  },
  playAnimation: function (direction) {
    if (!this.player.animations.currentAnim.isPlaying) {
      this.player.animations.play(direction);
    }
  }
};
