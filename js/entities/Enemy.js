/*global Phaser*/

// Enemy class
function Enemy (game, x, y, properties) {
    this.properties = properties;
    this.type = properties.sprite;
    Phaser.Sprite.call(this, game, x, y, this.type);


    this.health = 10;
};


Enemy.prototype = Object.create(Phaser.Sprite.prototype);
Enemy.prototype.constructor = Enemy;

Enemy.prototype.update = function () {
    if (this.game.globals.player.x < this.x) {
        this.body.velocity.x = -50;
    } else {
        this.body.velocity.x = 50;
    } 
    if (this.game.globals.player.y > this.y) {
        this.body.velocity.y = 25;
    } else {
        this.body.velocity.y = -25;
    }
}
