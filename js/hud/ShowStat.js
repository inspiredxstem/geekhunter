var RPG = RPG || {};

RPG.ShowStat = function (game_state, name, position, properties) {
    "use strict";
    RPG.TextPrefab.call(this, game_state, name, position, properties);
    
    this.prefab = this.game_state.prefabs[properties.prefab];
    this.stat = properties.stat;
};

RPG.ShowStat.prototype = Object.create(RPG.TextPrefab.prototype);
RPG.ShowStat.prototype.constructor = RPG.ShowStat;

RPG.ShowStat.prototype.update = function () {
    "use strict";
    this.text = this.prefab.stats[this.stat];
};