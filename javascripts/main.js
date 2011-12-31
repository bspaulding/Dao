$(document).ready(function() {
  var dao_game, dao_view;
  dao_game = new Dao();
  dao_view = new DaoTableView( $('#dao_board')[0], dao_game );
});