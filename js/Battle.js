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
    

    this.player = this.game.globals.player = new Player(this.game, 160 - 16, 180);
    this.game.add.existing(this.player);
    // hack to make player face up
    this.player.playAnimation('up');
    
    this.drawMenuBackground();
    this.drawMenu();
    this.drawStatusDisplay();

    console.log(this.game.globals.currentEnemy.properties);
    this.enemy = new Enemy(this.game, 160 - 16, 80, this.game.globals.currentEnemy.properties);
    this.game.add.existing(this.enemy);
    
    this.playerAttackTimeRemaining = null;
    this.enemyAttackTimeRemaining = null;
    this.currentAttacker = 'player'; // or 'enemy'

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
  drawMenu: function() {
    var style = { font: "20px Arial", fill: "#ffffff", align: "center" };
    var attackMenuText = this.game.add.text(25, 250, "Attack", style)
    var itemMenuText = this.game.add.text(25, 270, "Item", style)
    var fleeMenuText = this.game.add.text(25, 290, "Flee", style)

    this.mainMenuItems = [
      {text: attackMenuText, isHighlighted: false, index: 0, action: 'attack'},
      {text: itemMenuText,   isHighlighted: false, index: 1, action: 'activateItemsMenu'},
      {text: fleeMenuText,   isHighlighted: false, index: 2, action: 'flee'}
    ];
    
    this.menuItems = this.mainMenuItems;
    
    // this.hideMenu(this.menuItems);

    this.itemsMenuItems = [];
    for (var i = 0; i < this.player.inventory.length; i++) {
      var item = this.player.inventory[i];
      console.log(item);
      
      var itemText = this.game.add.text(25, 250 + i*20, item.name, style);

      this.itemsMenuItems.push({
        text: itemText,
        isHighlighted: false,
        index: i,
        action: 'useItem:' + i
      });
    }
    this.hideMenu(this.itemsMenuItems);
  },
  activateItemsMenu: function() {
    this.menuItems = this.itemsMenuItems;
    this.hideMenu(this.mainMenuItems);
    this.showMenu(this.itemsMenuItems);
    this.highlightMenuItem(this.itemsMenuItems[0]);
  },
  activateMainMenu: function() {
    this.menuItems = this.mainMenuItems;
    this.hideMenu(this.itemsMenuItems);
    this.showMenu(this.mainMenuItems);
    this.highlightMenuItem(this.menuItems[0]);
  },
  hideMenu: function(menuItems) {
    menuItems.forEach(function(menuItem) {
      menuItem.text.x = -100;
    });
  },
  showMenu: function(menuItems) {
    menuItems.forEach(function(menuItem) {
      menuItem.text.x = 25;
    });
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
    var self = this;
    if (action === 'attack') {
      this.playerAttackTimeRemaining = 1500;
      this.player.attack(this.enemy, function (damageAmount) {
        self.startAnimateDamageNumbers(self.enemy, damageAmount);
        self.playerAttackSound.play();
        self.shakeFrames = 18;
      });
    } else if (action === 'activateItemsMenu') {
      self.activateItemsMenu();
    } else if (action.split(':')[0] === 'useItem') {
      var itemIndex = parseInt(action.split(':')[1], 10);
      var item = this.player.inventory[itemIndex];
      this.useItem(item);
    } else if (action === 'flee'){
      return this.game.state.start('Game');
    }
  },
  useItem: function(item) {
    if (item.name.toLowerCase() === 'back') {
      this.activateMainMenu();
      return;
    }
    if (item.type === 'healing') {
      this.player.health += item.value;
    }
  },
  canPlayerMakeAction: function() {
    return (this.currentAttacker === 'player'
            && this.playerAttackTimeRemaining == null
    );
  },
  onEnter: function() {
    if (!this.canPlayerMakeAction()) {
      return;
    }
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
    // turn-based attack logic timing
    if (this.playerAttackTimeRemaining !== null) {
      this.playerAttackTimeRemaining -= this.game.time.elapsedMS;
      if (this.playerAttackTimeRemaining <= 0) {
        this.playerAttackTimeRemaining = null;
        this.currentAttacker = 'enemy';
      }
    }
    if (this.enemyAttackTimeRemaining !== null) {
      this.enemyAttackTimeRemaining -= this.game.time.elapsedMS;
      if (this.enemyAttackTimeRemaining <= 0) {
        this.enemyAttackTimeRemaining = null;
        this.currentAttacker = 'player';
      }
    }
    
    if (this.currentAttacker === 'enemy' && this.enemyAttackTimeRemaining === null) {
      this.enemyAttackTimeRemaining = 1500;
      var self = this;
      this.enemy.attack(this.player, function (damageAmount) {
        self.startAnimateDamageNumbers(self.player, damageAmount);
        self.playerAttackSound.play();
        self.shakeFrames = 18;
      });
    }
    
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
    
    // camera shake
    if (this.shakeFrames > 0) {
      var rand1 = this.game.rnd.integerInRange(-5, 5);
      var rand2 = this.game.rnd.integerInRange(-5, 5);
      this.game.world.setBounds(rand1, rand2, this.game.width + rand1, this.game.height + rand2);
      this.shakeFrames--;
      if (this.shakeFrames == 0) {
        this.game.world.setBounds(0, 0, this.game.width, this.game.height);
      }
    }
    
    // update hud
    this.statusDisplayHP .text = this.player.health;
    this.statusDisplayEnemyHP.text = this.enemy.health;
    
    //end battle
    if(this.player.health <= 0){
      this.game.state.start('GameOver')
    }
    if(this.enemy.health <= 0){
      this.game.state.start('Game');
    }
  }
};




