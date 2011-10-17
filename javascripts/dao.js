// dao.js
// Author: Bradley J. Spaulding
// A Dao game engine. 
// 
// NOTE: 
//   All point objects are arrays of [x,y]. 
//   However, when accessing into the board, 
//   you must reverse index into the 2-d array.

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
    'N' : [-1, 0],
    'NE': [-1, 1],
    'E' : [ 0, 1],
    'SE': [ 1, 1],
    'S' : [ 1, 0],
    'SW': [ 1,-1],
    'W' : [ 0,-1],
    'NW': [-1,-1]
  };

  Dao.prototype.winningPositions = (function() {
    var positions = [];
  
    // Horizontal Positions
    for ( var y = 0; y < 4; y += 1 ) {
      positions.push([ [0,y], [1,y], [2,y], [3,y] ]);
    }

    // Vertical Positions
    for ( var x = 0; x < 4; x += 1 ) {
      positions.push([ [x,0], [x,1], [x,2], [x,3] ]);
    }

    // Four Corners
    positions.push([ [0,0], [0,3], [3,0], [3,3] ]);

    // 2x2 Squares
    for ( var x = 0; x < 2; x += 1 ) {
      for ( var y = 0; y < 2; y += 1 ) {
        positions.push([ [x,y], [x,(y+1)], [(x+1),y], [(x+1),(y+1)] ]);
      }
    }

    return positions;
  }());

  Dao.prototype.valueAt = function(point) {
    return this.board[parseInt(point[1])][parseInt(point[0])];
  };

  Dao.prototype.canMove = function(from, to) {
    if ( this.winning_player ) {
      return false;
    }

    to[0] = parseInt(to[0]);
    to[1] = parseInt(to[1]);

    var legalMoves = this.legalMovesFromPosition(from);
    for ( var i = 0; i < legalMoves.length; i += 1 ) {
      var move = legalMoves[i];
      if ( move[0] === to[0] && move[1] === to[1] ) {
        return true;
      }
    }

    return false;
  };

  Dao.prototype.positionsForPlayer = function(player) {
    var positions = [];

    if ( player === 0 ) {
      return positions;
    }

    for ( var y = 0; y < 4; y += 1 ) {
      for ( var x = 0; x < 4; x += 1 ) {
        if ( this.valueAt([x,y]) === player ) {
          positions.push([x,y]);
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
    var new_position = [parseInt(position[0]) + transform[0], parseInt(position[1]) + transform[1]];

    if ( new_position[0] < 0 || new_position[0] > 3 || new_position[1] < 0 || new_position[1] > 3 ) {
      return false; // Off the board.
    }

    var new_board_value = this.valueAt(new_position);
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
    if ( !this.canMove(from, to) ) {
      return false;
    }
    
    var new_value = this.valueAt(from);
    var old_value = this.valueAt(to);
    this.board[to[1]][to[0]] = new_value;
    this.board[from[1]][from[0]] = old_value;

    if ( new_value === 1 ) {
      this.current_player = 2;
    } else {
      this.current_player = 1;
    }

    if ( this.gameOver() ) {
      this.winning_player = new_value;
    }

    return true;
  };

  Dao.prototype.gameOver = function() {
    for ( var i = 1; i < 3; i += 1 ) {
      var playerPositions = this.positionsForPlayer(i); // Array of points.
      for ( var j = 0; j < this.winningPositions.length; j += 1 ) {
        var winningPosition = this.winningPositions[j]; // Array of points.
        if ( playerPositions[0][0] == winningPosition[0][0] &&
             playerPositions[0][1] == winningPosition[0][1] &&

             playerPositions[1][0] == winningPosition[1][0] &&
             playerPositions[1][1] == winningPosition[1][1] &&

             playerPositions[2][0] == winningPosition[2][0] &&
             playerPositions[2][1] == winningPosition[2][1] &&

             playerPositions[3][0] == winningPosition[3][0] &&
             playerPositions[3][1] == winningPosition[3][1] ) {
          return true;   
        }
      }
    }

    return false;
  };

  return Dao;
}());