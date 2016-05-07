/*global Phaser*/

// Player class
function Player (game, x, y) {
    Phaser.Sprite.call(this, game, x, y, 'player');
    this.game.physics.arcade.enable(this);
    this.frame = 4; // set initial frame

    this.originalLocation = {x: x, y: y};
    var animationFPS = 8;
    this.animations.add('up', [0, 1, 2], animationFPS);
    this.animations.add('right', [3, 4, 5], animationFPS);
    this.animations.add('down', [6, 7, 8], animationFPS);
    this.animations.add('left', [9, 10, 11], animationFPS);

    this.maxSpeed = 50;
    this.sprintSpeed = 1000;

    this.health = 10;
    this.inventory = [
      { name: 'potion',    value: 20, type: 'healing',  description: 'Heals you for 20 HP'},
      { name: 'hi potion', value: 50, type: 'healing', description: 'Heals you for 50 HP' },
      { name: 'back', value: 50, type: 'action', description: 'what do you think it does? T_T' },
    ];
    this.mana = 50;
    this.strength = 10;
    this.defense = 1;
};


Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

Player.prototype.playAnimation = function (direction) {
    if (!this.animations.currentAnim.isPlaying) {
      this.animations.play(direction);
    }
};
Player.prototype.calculateDamage = function (enemyDefense){
 var random = 1 + Math.floor(Math.random() * 5);
 var damage = this.strength + random - enemyDefense;
 if(damage < 0){damage = 1};
 return damage;
}
Player.prototype.attack = function(enemy, callback) {
  console.log('Player is attacking:', enemy);
  
  var damageAmount = this.calculateDamage(enemy.defense);

  this.moveTo({x: enemy.x, y: enemy.y+32}, 500, function() {
    this.damage(enemy, damageAmount);
    callback(damageAmount);
    this.moveTo(this.originalLocation, 700);
  });
};

Player.prototype.moveTo = function(location, duration, callback) {
  callback = callback || function(){};
  
  var tween = this.game.add.tween(this).to(location, duration, "Quart.easeOut");
  tween.onComplete.add(callback, this);
  tween.start();
};

Player.prototype.damage = function(enemy, amount) {
   if(this.alive){
    enemy.health -= amount;
   } if(enemy.health <= 0){
     console.log('RIP');
     enemy.kill();
   }
};

Player.prototype.update = function() {
    var playerMaxSpeed = 50;
    
    if (!this.game) {
      return;
    }
    // "cheat" code to go fast
    if (this.game.input.keyboard.isDown(Phaser.KeyCode.SHIFT)) {
      playerMaxSpeed = 1000;
    }
    
    this.body.velocity.x = 0;
    
    if (this.game.state.current !== 'Battle') {

      if(this.game.cursors.up.isDown) {
        this.playAnimation('up');
        if(this.body.velocity.y == 0) {
          this.body.velocity.y -= playerMaxSpeed;
        }
      } else if(this.game.cursors.down.isDown) {
        this.playAnimation('down');
        if(this.body.velocity.y == 0) {
          this.body.velocity.y += playerMaxSpeed;
        }
      } else {
        this.body.velocity.y = 0;
      }
      if(this.game.cursors.left.isDown) {
        this.playAnimation('left');
        this.body.velocity.x -= playerMaxSpeed;
      } else if(this.game.cursors.right.isDown) {
        this.playAnimation('right');
        this.body.velocity.x += playerMaxSpeed;
      }
    }

};
