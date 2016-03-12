/*global Phaser*/
var TopDownGame = TopDownGame || {};

//Battle state
TopDownGame.Battle = function () {};

TopDownGame.Battle.prototype = {
  create: function() {
    // this.stage.backgroundColor = "#000000";
    // this.player = this.game.globals.player;
    this.playerAttackSound = this.game.add.audio('knifeslash');
    
    this.wasPressed = {
      left: false,
      right: false,
      up: false,
      down: false
    };
    
    this.map = this.game.add.tilemap('dungeonbattle');
    this.map.addTilesetImage('tiles', 'gameTiles');
    this.map.addTilesetImage('dungeontileset', 'dungeontileset');
    //create layer
    this.backgroundlayer = this.map.createLayer('backgroundLayer');
    
    this.drawMenuBackground();
    this.drawMenuItems();
    this.drawStatusDisplay();

    this.player = this.game.globals.player = new Player(this.game, 160 - 16, 180);
    this.game.add.existing(this.player);
    // hack to make player face up
    this.player.playAnimation('up');
    

    console.log(this.game.globals.currentEnemy.properties);
    this.enemy = new Enemy(this.game, 160 - 16, 80, this.game.globals.currentEnemy.properties);
    this.game.add.existing(this.enemy);

    this.enterKey = this.game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
    this.enterKey.onDown.add(this.onEnter, this);
  },
  drawMenuBackground: function() {
    var rect = this.game.add.graphics(0, 0);
    rect.beginFill(0x000000);
    rect.lineStyle(2, 0xFFFFFF, 1);
    rect.drawRect(0, 250, 320, 100);
    rect.alpha = 0.5;
    
    rect.beginFill(0xFFFFFF);
    rect.lineStyle(0, 0x0000FF, 1);
    var lineWidth = 2;
    rect.drawRect(160 - (lineWidth/2), 251, lineWidth, 100);
  },
  drawMenuItems: function() {
    var style = { font: "20px Arial", fill: "#ffffff", align: "center" };
    var attackMenuText = this.game.add.text(25, 250, "Attack", style)
    var itemMenuText = this.game.add.text(25, 270, "Item", style)
    var fleeMenuText = this.game.add.text(25, 290, "Flee", style)

    this.menuItems = [
      {text: attackMenuText, isHighlighted: false, index: 0, action: 'attack'},
      {text: itemMenuText,   isHighlighted: false, index: 1, action: 'item'},
      {text: fleeMenuText,   isHighlighted: false, index: 2, action: 'flee'}
    ];
  },
  drawStatusDisplay: function() {
    var style = { font: "20px Arial", fill: "#ffffff", align: "left" };
    this.statusDisplayHPLabel = this.game.add.text(180, 250, "HP:", style);
    this.statusDisplayHP = this.game.add.text(225, 250, "", style);
    this.statusDisplayEnemyHPLabel = this.game.add.text(180, 290, "E HP:", style);
    this.statusDisplayEnemyHP = this.game.add.text(235, 290, "", style);
  },
  highlightMenuItem: function(menuItem) {
    menuItem.isHighlighted = true;
    menuItem.text.addColor("#FFFF00", 0);
  },
  unHighlightMenuItem: function(menuItem) {
    menuItem.isHighlighted = false;
    menuItem.text.addColor("#FFFFFF", 0);
  },
  getCurrentMenuItem: function() {
    var currentMenuItem = this.menuItems[0];
    
    for (var i = 0; i<this.menuItems.length; i++) {
      if (this.menuItems[i].isHighlighted) {
        currentMenuItem = this.menuItems[i];
      }
    }
    return currentMenuItem;
  },
  triggerAction: function(action) {
    console.log(action);
    if (action === 'attack') {
      var damageAmount = this.player.attack(this.enemy);
      this.startAnimateDamageNumbers(this.enemy, damageAmount);
      this.playerAttackSound.play();
    }
  },
  onEnter: function() {
    var currentMenuItem = this.getCurrentMenuItem();
    this.triggerAction(currentMenuItem.action);
  },
  startAnimateDamageNumbers: function(sprite, damageAmount) {
    damageAmount = damageAmount || 0;
    var style = { font: "18px Arial", fill: "#ffffff", align: "center" };
    sprite.currentDamageText = this.game.add.text(sprite.x+16, sprite.y-12, damageAmount, style);
    sprite.currentDamageTimeStart = Date.now();
  },
  animateDamageNumbers: function(sprite) {
    if (!sprite.currentDamageText) { return; }
    if (Date.now() - sprite.currentDamageTimeStart > 1000) {
      this.game.world.remove(sprite.currentDamageText);
      sprite.currentDamageText = null;
      return;
    }
    sprite.currentDamageText.y -= 1;
    sprite.currentDamageText.alpha -= 0.02;
  },
  
  
  
  
  
  
  update: function() {
    var currentMenuItem = this.getCurrentMenuItem();
    var currentMenuItemIndex = currentMenuItem.index;
    
    // look at wasPressed and ignore keyrepeat
    if(this.game.cursors.up.isDown && !this.wasPressed.up) {
      if (currentMenuItem.index === 0) {
        currentMenuItemIndex = this.menuItems.length - 1;
      } else {
        currentMenuItemIndex--;
      }
    } else if(this.game.cursors.down.isDown && !this.wasPressed.down) {
      if (currentMenuItem.index === this.menuItems.length - 1) {
        currentMenuItemIndex = 0;
      } else {
        currentMenuItemIndex++;
      }
    }

    // unhighlight all menu items, then highlight the correct one
    for (var i = 0; i<this.menuItems.length; i++) {
      if (this.menuItems[i].isHighlighted) {
        this.unHighlightMenuItem(this.menuItems[i]);
      }
    }
    currentMenuItem = this.menuItems[currentMenuItemIndex];
    this.highlightMenuItem(currentMenuItem);

    this.wasPressed.up = this.game.cursors.up.isDown;
    this.wasPressed.down = this.game.cursors.down.isDown;
    
    // run animations
    this.animateDamageNumbers(this.player);
    this.animateDamageNumbers(this.enemy);
    
    // update hud
    this.statusDisplayHP.text = this.player.health;
    this.statusDisplayEnemyHP.text = this.enemy.health;
  }
};
