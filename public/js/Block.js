var id = 1000;
var taken = { };

class Block {
  static valid(x) {
    return !taken[x] && !taken[x - 1] && !taken[x + 1];
  }

  static addBlockPos (x) {
    taken[x] = true;
    taken[x - 1] = true;
    taken[x + 1] = true;
  }

  static nextId(){
    return id++;
  }

  constructor(opts){
    this.size = opts.size;
    this._position = opts.position || this._generatePosition();
    this._value = opts.value || 10;

    this.id = Block.nextId();
  }

  get position() {
    return this._position;
  }

  set world (w){
    this._world = w;
  }

  _generatePosition () {
    var taken = true;
    var px;

    while (taken){
      px = Rand.between (3, this.size.x - 3);
      taken = !Block.valid (px);
    }

    Block.addBlockPos (px);
    return {
      x: px,
      y: 1
    };
  }

  interact(p){
    this._world.removeBlock(this);
    p.addCoins (this._value);
  }



  static generate(n, opts){
    if (!n) n = 100;
    var blocks = { };

    for (var i = 0; i < n; i++){
      var block = new Block(opts);
      blocks [block.id] = block;
    }

    return blocks;
  }
}
