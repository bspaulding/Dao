var Dao;
Dao = (function() {
  function Dao(the_players) {
    this.players = the_players;
    this.current_player = 1;
    this.board = [
      [1, 0, 0, 2],
      [0, 1, 2, 0],
      [0, 2, 1, 0],
      [2, 0, 0, 1]
    ];
  };

  Dao.prototype.directionMappings = {
    'N': [-1, 0],
    'E': [ 0, 1],
    'S': [ 1, 0],
    'W': [ 0,-1]
  };

  Dao.prototype.start = function() {
    
  };

  Dao.prototype.canMove = function(from, to) {
    var from_value = this.board[from[0]][from[1]];
    var to_value = this.board[to[0]][to[1]];
    
    if ( from_value === 0 ) {
      return false;
    }

    if ( to_value !== 0 ) {
      return false;
    }

    return true;
  };

  Dao.prototype.positionsForPlayer = function(player) {
    var positions = [];

    if ( player === 0 ) {
      return positions;
    }

    for ( var y = 0; y < 3; y += 1 ) {
      for ( var x = 0; x < 3; x += 1 ) {
        if ( this.board[y][x] === player ) {
          positions.push([y, x]);
        }
      }
    }

    return positions;
  };

  Dao.prototype.legalMovesFromPosition = function(from) {
    var moves = [];

    for ( var direction in this.directionMappings ) {
      var move = this.legalMoveFromPositionInDirection(from, direction);
      if ( move ) {
        moves.push(move);
      }
    }

    return moves;
  };

  Dao.prototype.legalMovesForPlayer = function(player) {
    var positions = this.positionsForPlayer(player);
    var moves = [];

    for ( var i = 0; i < positions.length; i += 1 ) {
      var movesFromPosition = this.legalMovesFromPosition(positions[i]);
      for ( var k = 0; k < movesFromPosition.length; k += 1 ) {
        moves.push(movesFromPosition[k]);
      }
    }

    return moves;
  };

  Dao.prototype.legalMoveFromPositionInDirection = function(position, direction) {
    var transform = this.directionMappings[direction];
    var new_position = [parseInt(position[0]) + parseInt(transform[0]), parseInt(position[1]) + parseInt(transform[1])];

    if ( new_position[0] < 0 || new_position[0] > 3 || new_position[1] < 0 || new_position[1] > 3 ) {
      return false; // Off the board.
    }

    console.log('new_position => ');
    console.log(new_position);
    var new_board_value = this.board[new_position[0]][new_position[1]];
    if ( new_board_value !== 0 ) {
      return false; // Space taken.
    }

    var canKeepMoving = this.legalMoveFromPositionInDirection(new_position, direction);
    if ( canKeepMoving ) {
      return canKeepMoving;
    } else {
      return new_position;
    }
  }

  Dao.prototype.move = function(from, to) {
    if ( !this.canMove(from, to) )
      return false;
    
    var new_value = this.board[from[0]][from[1]];
    var old_value = this.board[to[0]][to[1]];
    this.board[to[0]][to[1]] = new_value;
    this.board[from[0]][from[1]] = old_value;

    if ( new_value === 1 ) {
      this.current_player = 2;
    } else {
      this.current_player = 1;
    }
  };

  return Dao;
}());