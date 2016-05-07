/*global Phaser*/

// Enemy class
function Enemy (game, x, y, properties) {
    this.properties = properties;
    this.type = properties.sprite;
    Phaser.Sprite.call(this, game, x, y, this.type);
    // this.game.physics.arcade.enable(this);
    
    this.originalLocation = {x: x, y: y};


    this.health = 50;
    this.defense = 6;
    this.strength = 4;
};


Enemy.prototype = Object.create(Phaser.Sprite.prototype);
Enemy.prototype.constructor = Enemy;


Enemy.prototype.update = function (){
    if (!this.body || this.game.state.current === 'Battle') {
        // TODO: fix
        //console.log('blah');
        return;
    }
    
    if (this.game.globals.player.x < this.x) {
        this.body.velocity.x = -50;
    } else {
        this.body.velocity.x = 50;
    } 
    if (this.game.globals.player.y > this.y) {
        this.body.velocity.y = 50;
    } else {
        this.body.velocity.y = -50;
    }
}

Enemy.prototype.calculateDamage = function (playerDefense){
 var random = 1 + Math.floor(Math.random() * 10);
 var damage = this.strength + random - playerDefense;
 if(damage < 0){damage = 1};
 return damage;
}

Enemy.prototype.attack = function(player, callback) {
  callback = callback || function(){};
  console.log('Enemy is attacking:', player);
  var damageAmount = this.calculateDamage(player.defense);

  this.moveTo({x: player.x, y: player.y-32}, 500, function() {
    this.damage(player, damageAmount);
    callback(damageAmount);
    this.moveTo(this.originalLocation, 700);
  });
};
Enemy.prototype.damage = function(target, amount) {
   if(this.alive){
    target.health -= amount;
   } if(target.health <= 0){
     console.log('RIP');
     target.kill();
   }
};

Enemy.prototype.moveTo = function(location, duration, callback) {
  callback = callback || function(){};
  
  var tween = this.game.add.tween(this).to(location, duration, "Quart.easeOut");
  tween.onComplete.add(callback, this);
  tween.start();
};