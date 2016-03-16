/*global Phaser*/

// Player class
function Player (game, x, y) {
    Phaser.Sprite.call(this, game, x, y, 'player');
    this.game.physics.arcade.enable(this);
    this.frame = 4; // set initial frame

    var animationFPS = 8;
    this.animations.add('up', [0, 1, 2], animationFPS);
    this.animations.add('right', [3, 4, 5], animationFPS);
    this.animations.add('down', [6, 7, 8], animationFPS);
    this.animations.add('left', [9, 10, 11], animationFPS);

    this.maxSpeed = 50;
    this.sprintSpeed = 1000;

    this.health = 10000000000;
    this.inventory = ['potion', 'potion'];
    this.mana = 50;
    this.strength = 10;
    this.defense = 7;
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
 return damage;
}
Player.prototype.attack = function(enemy) {
  console.log('Player is attacking:', enemy);
  //TODO:

  // reduce enemy health
  // display damage above enemy
  // trigger damage number animation
  // maybe animate enemy shake
  
  var damageAmount = this.calculateDamage(enemy.defense);
   if(this.alive){
    enemy.health -= damageAmount;
   } if(enemy.health <= 0){
     console.log('RIP');
     enemy.kill();
   }
  
  return damageAmount;
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
