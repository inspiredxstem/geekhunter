var RPG = RPG || {};

RPG.PlayerMenuItem = function (game_state, name, position, properties) {
    "use strict";
    RPG.MenuItem.call(this, game_state, name, position, properties);
    
    this.player_unit_health = new RPG.ShowStat(this.game_state, this.text + "_health", {x: 280, y: this.y}, {group: "hud", text: "", style: properties.style, prefab: this.text, stat: "health"});
};

RPG.PlayerMenuItem.prototype = Object.create(RPG.MenuItem.prototype);
RPG.PlayerMenuItem.prototype.constructor = RPG.PlayerMenuItem;

RPG.PlayerMenuItem.prototype.select = function () {
    "use strict";
};