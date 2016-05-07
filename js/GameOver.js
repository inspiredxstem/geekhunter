var TopDownGame = TopDownGame || {};

TopDownGame.GameOver = function () {};

TopDownGame.GameOver.prototype = {
    create: function(){
        this.drawMenuBackground();
        this.drawGameOver();
    },
    drawMenuBackground: function() {
    var rect = this.game.add.graphics(0, 0);
    rect.beginFill(0x000000);
    rect.lineStyle(2, 0xFFFFFF, 1);
    rect.drawRect(0, 0, 320, 320);
    rect.alpha = 1;
  },
    drawGameOver: function() {
        var style = { font: "1000px ", fill: "#ffffff", align: "center"};
        var gameover = this.game.add.text(50, 50, "Get REKT son", style);
         
    }
}

