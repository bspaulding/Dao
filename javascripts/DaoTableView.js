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
        td.appendChild(this.contentForBoardIndex(k,i));
        tr.appendChild(td);
      }
      table.appendChild(tr);
    }
    this.root.innerHTML = '';
    this.root.appendChild(table);
  };

  DaoTableView.prototype.contentForBoardIndex = function(x, y) {
    var content, board_value = this.dao_game.board[x][y];

    var isLegalMove = false;
    if ( this.legalMoves ) {
      for ( var i = 0; i < this.legalMoves.length; i += 1 ) {
        var move = this.legalMoves[i];
        if ( move[0] === y && move[1] === x ) {
          console.log('Found Legal Move: (' + move[0] + ', ' + move[1] + ')');
          isLegalMove = true;
        }
      }
    }
    
    if ( (board_value === this.dao_game.current_player  && 'undefined' === typeof this.from) || ('undefined' !== typeof this.from && isLegalMove) ) {
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
    console.log('Selected Position: (' + x + ', ' + y + ') => ' + this.dao_game.board[x][y]);

    if ( 'undefined' === typeof this.from ) {
      this.from = [x, y];
      this.legalMoves = this.dao_game.legalMovesFromPosition(this.from);
    } else {
      this.dao_game.move(this.from, [x,y]);
      delete this.from;
      delete this.legalMoves;
    }

    this.render();
  };

  return DaoTableView;
}());