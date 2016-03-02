/*global Phaser*/
var TopDownGame = TopDownGame || {};

//Battle state
TopDownGame.Battle = function () {};

TopDownGame.Battle.prototype = {
  create: function() {
    this.stage.backgroundColor = "#000000";
   //this.stage.height = 10; 
   //this.stage.width = 50; 
    // this.player = this.game.globals.player;
    this.player = this.game.globals.player = new Player(this.game, 200, 200);
    this.game.add.existing(this.player);
    this.player.scale.set = (16, 16, 1);
    this.game.camera.follow(this.player);

    this.enemy = new Enemy(this.game, 200, 400, this.game.globals.currentEnemy.properties);
    this.game.add.existing(this.enemy);
    console.log("log 1", this.game);
  },
  update: function() {
    
  }
};
