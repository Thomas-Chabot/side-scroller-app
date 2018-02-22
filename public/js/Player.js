class Player {
  constructor(options){
    this._position = {
      x: 0,
      y: options.size.y - 1
    };
    this._world = options.world;

    this.maxX = options.size.x;
    this._jumping = false;

    this._coins = 0;
  }

  get position(){
    return this._position;
  }

  set world (w) {
    this._world = w;
  }

  get coins () { return this._coins; }

  play(){
    return new Promise((fulfill,reject)=>{
      fulfill();
    })
  }

  addCoins (n){
    this._coins += n;
  }

  _interactWithBlock(block){
    block.interact(this);
  }

  _left(){
    if (this._position.x <= 0) return false;
    this._checkForCollision (this._position.x - 2, this._position.y);

    return this._moveTo (this._position.x - 1, this._position.y);
  }
  _right(){
    if (this._position.x >= this.maxX - 1) return false;
    this._checkForCollision (this._position.x + 2, this._position.y);
    return this._moveTo (this._position.x + 1, this._position.y);
  }

  _checkForCollision (x, y) {
    var thing = this._world.get({x, y});
    switch (this._world.check ({x, y})){
      case TYPES.None:
        return false;
      case TYPES.Block:
        this._interactWithBlock (thing);
        return TYPES.Block;
      case TYPES.Player:
        if (this._jumping){
          this._interact (thing);
          return false;
        }else{
          thing._interact (this);
          return TYPES.Player;
        }
    }
  }

  _moveTo (x, y){
    if (this._checkForCollision (x, y))
      return false;

    this.position.x = x;
    this.position.y = y;
    return true;
  }

}
