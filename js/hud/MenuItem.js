var RPG = RPG || {};

RPG.MenuItem = function (game_state, name, position, properties) {
    "use strict";
    RPG.TextPrefab.call(this, game_state, name, position, properties);
};

RPG.MenuItem.prototype = Object.create(RPG.TextPrefab.prototype);
RPG.MenuItem.prototype.constructor = RPG.MenuItem;

RPG.MenuItem.prototype.selection_over = function () {
    "use strict";
    this.fill = "#FFFF00";
};

RPG.MenuItem.prototype.selection_out = function () {
    "use strict";
    this.fill = "#FFFFFF";
};