var RPG = RPG || {};

RPG.AttackMenuItem = function (game_state, name, position, properties) {
    "use strict";
    RPG.MenuItem.call(this, game_state, name, position, properties);
};

RPG.AttackMenuItem.prototype = Object.create(RPG.MenuItem.prototype);
RPG.AttackMenuItem.prototype.constructor = RPG.AttackMenuItem;

RPG.AttackMenuItem.prototype.select = function () {
    "use strict";
    // disable actions menu
    this.game_state.prefabs.actions_menu.disable();
    // enable enemy units menu so the player can choose the target
    this.game_state.prefabs.enemy_units_menu.enable();
};