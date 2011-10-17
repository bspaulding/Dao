// DaoTableView.js
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
      alert("Player " + this.dao_game.winning_player + " won!");
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
      content = document.createElement('a');
      content.setAttribute('href', '#');
      content.setAttribute('data-DaoBoardX', x);
      content.setAttribute('data-DaoBoardY', y);
      content.setAttribute('class', 'selectable');
      content.textContent = board_value;
      content.addEventListener('click', this.handlePositionSelected);
    } else {
      content = document.createTextNode(board_value);
    }

    return content;
  };

  DaoTableView.prototype.handlePositionSelected = function(event) {
    var x = event.target.getAttribute('data-DaoBoardX');
    var y = event.target.getAttribute('data-DaoBoardY');

    if ( 'undefined' === typeof this.from ) {
      this.from = [x, y];
      this.legalMoves = this.dao_game.legalMovesFromPosition(this.from);
    } else {
      if ( this.dao_game.move(this.from, [x,y]) ) {
        delete this.from;
        delete this.legalMoves;
        if ( this.dao_game.gameOver() ) {
          this.game_over = true;
        }
      } else {
        alert("Can't move from (" + this.from[0] + ',' + this.from[1] + ") to (" + x + ',' + y + ")");
      }
    }

    this.render();
  };

  return DaoTableView;
}());