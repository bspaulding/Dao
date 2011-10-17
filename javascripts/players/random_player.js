var RandomPlayer;
RandomPlayer = (function() {
  function RandomPlayer(a_game, a_player_number) {
    this.game = a_game;
    this.number = a_player_number;
  };

  RandomPlayer.prototype.nextMove = function() {
    var index = Math.floor(Math.random() * 4);
    var moves = this.game.legalMovesForPlayer(this.number);
    return moves[index];
  };

  return RandomPlayer;
}());