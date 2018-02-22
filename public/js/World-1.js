class World {
  // constructor
  constructor (options) {
    this.size = options.size;

    this.blocks = { };
    this.players = { };
    this.center  = options.center || 0;
    this.screenSize = options.screenSize || 3;

    this._update(options);

    this._map = this._generate();
  }

  // moving
  movePlayers(players) {
    this._updatePlayers (players);
  }

  // centered
  recenter(position){
    this.center = position;
  }

  /* --- PRIVATE METHODS */

  /* -- updating -- */
  _update(options){
    this._updateBlocks (options.blocks);
    this._updatePlayers (options.players);
  }

  _updateBlocks (blocks) {
    if (!blocks) return;
    for (var id in blocks){
      this._makeUpdate (this.blocks, id, blocks[id]);
    }
  }
  _updatePlayers (players){
    if (!players) return;
    for (var playerName in players)
      this._makeUpdate (this.players, playerName, players[playerName]);
  }

  _makeUpdate (from, id, values){
    if (!from || !values) return;

    if (from[id]){
      // only update the things included in values
      for (var key in values){
        from [id] [key] = values [key];
      }
    } else
      from[id] = values;
  }

  /* -- drawing / generating -- */
  _generate(){
    var map = this._generateMap();

    this._drawBlocks (map);
    this._drawGround (map);
    this._drawPlayers (map);

    return map;
  }

  _generateMap(){
    var map = [ ];
    var [from, to] = this._getShown ();

    for (var y = 0; y < this.size.y; y++){
      map[y] = [ ];
      for (var x = from; x < to; x++){
        map[y][x] = " ";
      }
    }
    return map;
  }

  _drawBlocks(map){
    for (var i in this.blocks){
      var block = this.blocks[i];
      var p     = block.position;

      if (!p || !map [p.y - 1][p.x] || !map [p.y] [p.x - 1] || !map [p.y][p.x] || !map[p.y][p.x + 1]) continue;

      map [p.y - 1][p.x] = '_';
      map [p.y][p.x - 1] = '|';
      map [p.y][p.x] = '_';
      map [p.y][p.x + 1] = '|';
    }
  }

  _drawGround(map){
    var [from, to] = this._getShown();

    for (var x = from; x < to; x++){
      map [map.length - 1][x] = "_";
    }
  }

  _drawPlayers(map){
    for (var i in this.players){
      var player   = this.players[i];
      var position = player.position;

      if (!map[position.y][position.x]) continue;

      map [position.y][position.x] = 'x';
    }
  }

  _getShown () {
    var os = this.screenSize;
    if (this.center - os/2 < 0){
      return [0, os]
    }
    if (this.center + os/2 > this.size.x){
      return [this.size.x - os, this.size.x];
    }

    var from = Math.max (0, this.center - os/2);
    var to   = Math.min (this.center + os/2, this.size.x);
    return [from, to];
  }

  /* --- OVERRIDES --- */
  toString(){
    var map = this._generate();
    var [fX, tX] = this._getShown();

    var s = "";
    for (var y = 0; y < map.length; y++){
      for (var x = fX; x < tX; x++){
        s += map[y][x];
      }
      s += "\n";
    }

    return s;
  }

}
