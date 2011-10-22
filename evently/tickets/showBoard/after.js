function(e, board) {
	var elem = $(this);

	function saveBoard() {
		db.saveDoc(board, {
			success: function(data) {
				elem.trigger('board', [board._id]);
			}
		});
	}

	var stages = elem.find('#stages');

	if (board.stages) {
		$.each(board.stages, function(i, stage) {
			stages.append($('<div/>').text(stage + ' ').append($('<button type="button" data-icon="remove"/>').data('index', i)));
		});
	}

	stages.sortable({
		placeholder: 'ui-state-highlight',
		update: function(e, ui) {
			board.stages = $(this).children().map(function() {
				return [$(this).data('stage')];
			}).get();

			saveBoard();
		}
	}).disableSelection().children().each(function(i) {
		$(this).data('stage', board.stages[i]);
	}).find('button').click(function() {
		board.stages.splice(parseInt($(this).data('index')), 1);

		saveBoard();
	});

	elem.find('#addStage').submit(function() {
		var form = $(this);

		var stage = form.find('[name=name]').val();

		if (stage != '') {
			if (!board.stages) {
				board.stages = [];
			}

			board.stages.push(stage);

			saveBoard();
		}

		return false;
	});

	setPage('board', [board._id]);
	startPolling({
		filter: design + '/document',
		id: board._id
	});

	ui();
	elem.find('#addStage [name=name]').focus();
}