// dao_table_view.js
// Author: Bradley J. Spaulding
// A simple HTML <table> view for Dao.

var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
var DaoTableView;
DaoTableView = (function() {
  function DaoTableView(a_root_element, a_dao_game) {
    this.handlePositionSelected = __bind(this.handlePositionSelected, this);

    this.root = a_root_element;
    this.root.setAttribute('class', 'DaoTableView');
    this.dao_game = a_dao_game;

    // this.computer_player = new RandomPlayer(this.dao_game, 2);
    this.render();
  };

  DaoTableView.prototype.render = function() {
    var table = document.createElement('table');
    for( var i = 0; i < 4; i++ ) {
      var tr = document.createElement('tr');
      for( var k = 0; k < 4; k++ ) {
        var td = document.createElement('td');
        td.appendChild(this.contentForBoardIndex(i,k));
        tr.appendChild(td);
      }
      table.appendChild(tr);
    }
    this.root.innerHTML = '';
    this.root.appendChild(table);

    if ( this.game_over ) {
      alert("Player " + this.dao_game.winning_player + " is the winner!");
    }
  };

  DaoTableView.prototype.contentForBoardIndex = function(x, y) {
    var content, board_value = this.dao_game.valueAt([x, y]);

    var isLegalMove = false;
    if ( this.legalMoves ) {
      for ( var i = 0; i < this.legalMoves.length; i += 1 ) {
        var move = this.legalMoves[i];
        if ( move[0] === x && move[1] === y ) {
          isLegalMove = true;
        }
      }
    }
    
    if ( !this.game_over && (board_value === this.dao_game.current_player  && 'undefined' === typeof this.from) || ('undefined' !== typeof this.from && isLegalMove) ) {
      content = document.createElement('img');
      if ( board_value === 1 ) {
        content.setAttribute('src', 'images/a_stone_clipped.png');
      } else if ( board_value === 2 ) {
        content.setAttribute('src', 'images/a_stone_dark_clipped.png');
      } else { // board_value === 0
        if ( this.dao_game.current_player === 1 ) {
          content.setAttribute('src', 'images/a_stone_clipped.png');
        } else {
          content.setAttribute('src', 'images/a_stone_dark_clipped.png');
        }
        content.setAttribute('style', 'opacity: 0.5;')
      }

      content.setAttribute('class', 'selectable player-' + board_value);
    } else {
      var content = document.createElement('img');
      if ( board_value === 1 ) {
        content.setAttribute('src', 'images/a_stone_clipped.png');
      } else if ( board_value === 2 ) {
        content.setAttribute('src', 'images/a_stone_dark_clipped.png');
      } else {
        content.setAttribute('src', 'images/pixel.gif');
      }
      content.setAttribute('class', 'player-' + board_value);
    }

    if ( this.dao_game.current_player === board_value ) {
      content.setAttribute('class', 'wiggle');
    }

    if ( this.from && parseInt(this.from[0]) === x && parseInt(this.from[1]) === y ) {
      content.setAttribute('class', content.getAttribute('class') + ' selected');
    }

    content.addEventListener('click', this.handlePositionSelected);

    content.setAttribute('data-DaoBoardX', x);
    content.setAttribute('data-DaoBoardY', y);

    return content;
  };

  DaoTableView.prototype.handlePositionSelected = function(event) {
    var x = event.target.getAttribute('data-DaoBoardX');
    var y = event.target.getAttribute('data-DaoBoardY');

    if ( 'undefined' === typeof this.from ) {
      this.from = [x, y];
      this.legalMoves = this.dao_game.legalMovesFromPosition(this.from);
    } else {
      if ( this.from[0] === x && this.from[1] === y ) {
        delete this.from;
      } else if ( this.dao_game.move(this.from, [x,y]) ) {
        delete this.from;
        delete this.legalMoves;
        if ( this.dao_game.gameOver() ) {
          this.game_over = true;
        }

        // Computer Player
        // var computer_move = this.computer_player.nextMove();
        // this.dao_game.move(computer_move[0], computer_move[1]);
      } else {
        alert("Can't move from (" + this.from[0] + ',' + this.from[1] + ") to (" + x + ',' + y + ")");
      }
    }

    this.render();
  };

  return DaoTableView;
}());