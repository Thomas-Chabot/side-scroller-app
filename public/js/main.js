var gameboard;

var size = {
  x: 3500,
  y: 4
};

function main(){
  var human = new Human({size});
  var players = {human};

  var blocks = Block.generate(350, {size});

  var map = new World({
      size,
      blocks,
      players,
      screenSize: 100
  });

  human.world = map;
  for (var b in blocks){
    var block = blocks[b];
    block.world = map;
  }

  function _next (){
    map.movePlayers (players);
    map.recenter (human.position.x);

    gameboard.html(map.toString().replace(/\n/g, "<br>").replace(/ /g, "&nbsp;"));

    human.play().then (_next);
  }

  _next();
}

$(()=>{
  gameboard = $("#gameboard");
  main();
});
