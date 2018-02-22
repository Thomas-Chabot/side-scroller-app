class Human extends Player {

  constructor(...args){
    super(...args);

    this._inputCb = [ ];

    $(document.body).on("keydown", (...args)=>{
      if (!this._isPlaying) return false;

      this._input (...args);
    });
  }

  play(){
    return new Promise((fulfill,reject)=>{
      this._isPlaying = true;
      this._inputCb.push (fulfill);
    });
  }

  _input (event){
    switch (event.which){
      case 37: // left
        if (this._left())
          this._onInput();

        break;
      case 39: // right
        if (this._right())
          this._onInput();
        break;
    }
  }

  _onInput () {
    for (var f of this._inputCb){
      f();
    }
    this._inputCb = [ ];
  }
}
