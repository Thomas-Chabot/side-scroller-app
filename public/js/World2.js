var TYPES = {
  Block: 1,
  Player: 2,
  None: 3
};

class World {
  constructor (options){
      this.size = options.size;

      this.blocks = { };
      this.players = { };
      this.center  = options.center || 0;
      this.screenSize = options.screenSize || 3;
      this._cache = { };

      this._update(options);

      this._things = this._generate();
  }

  movePlayers(players) {
    this._update({players});
  }

  // centered
  recenter(position){
    this.center = position;
  }

  // check if there's a thing in a given position
  check (position){
    return this._getThing (position.x, position.y);
  }

  // get thing at positions
  get (position){
    return this._thingAt (position.x, position.y);
  }

  removeBlock (block) {
    delete this.blocks[block.id];
    this._removeFromCache (block.id);
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

    this._updateFromCache (id, values);

    if (from[id]){
      // only update the things included in values
      for (var key in values){
        from [id] [key] = values [key];
      }
    } else
      from[id] = values;
  }

  /* --- caching / updating positions --- */
  _updateFromCache (id, values){
    if (this._cache[id]){
      this._removeFromCache (id);
    }
    this._addToCache (id, values);
  }

  _removeFromCache (id) {
    var p = this._cache [id];
    if (!p) return;

    delete this._things [p.y][p.x];
    delete this._cache [id];
  }

  _addToCache (id, values){
    var p = values.position;
    if (!p) return;

    this._cache [id] = {
      x: p.x,
      y: p.y
    };

    if (!this._things) return;
    if (!this._things [p.y])
      this._things [p.y] = [ ];
    this._things [p.y][p.x] = values;

    var y = p.y, x = p.x;
  }


  /* --- generating ---- */
  _generate(){
    var map = this._generateMap();

    this._genBlocks (map);
    this._genGround (map);
    this._genPlayers (map);

    return map;
  }

  _generateMap(){
    return { };
  }

  _genBlocks(map){
    for (var i in this.blocks){
      var block = this.blocks[i];
      var pos   = block.position;

      if (!map [pos.y]) map[pos.y] = { };
      map [pos.y][pos.x] = block;
    }
  }

  _genGround(map){
  }

  _genPlayers(map){
    for (var i in this.players){
      var player   = this.players[i];
      var position = player.position;

      if (!map [position.y]) map[position.y] = { };
      map[position.y][position.x] = player;
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

  /* --- things --- */
  _thingAt (x, y){
    return this._things[y] && this._things[y][x];
  }
  _getThing (x, y) {
    var thing = this._thingAt (x, y);
    if (!thing) return TYPES.None;
    if (thing instanceof Block) return TYPES.Block;
    if (thing instanceof Player) return TYPES.Player;
    return TYPES.None;
  }

  /* --- drawing ---- */
  _draw () {
    var str = this._drawMap();
    this._drawThings (str);
    return str;
  }

  _drawMap () {
    var [from, to] = this._getShown();

    var s = [ ];

    // draw the air
    for (var y = 0; y < this.size.y - 1; y++){
      s[y] = [ ];
      for (var x = from; x < to; x++){
        s[y][x] = ' ';
      }
    }

    // draw the ground
    s[this.size.y-1] = [ ];
    for (var x = from; x < to; x++){
      s[this.size.y-1][x] = '_';
    }

    return s;
  }

  _drawThings (str) {
    var [from, to] = this._getShown();

    for (var y = 0; y < this.size.y; y++){
      for (var x = from; x < to; x++){
        switch (this._getThing (x, y)) {
          case TYPES.Block:
            this._drawBlock (str, x, y);
            break;
          case TYPES.Player:
            this._drawPlayer (str, x, y);
            break;
          default:
            break;
        }
      }
    }
  }

  _drawBlock (str, x, y){
    str [y][x] = "_";
    str [y - 1][x] = "_";
    str [y][x - 1] = "|";
    str [y][x + 1] = "|";
  }

  _drawPlayer (str, x, y){
    str[y][x] = "x";
  }


  toString(){
    var map = this._draw();
    var s = "";
    for (var y in map){
      for (var x in map[y]){
        s += map[y][x];
      }
      s += "\n";
    }
    return s;
  }
}
