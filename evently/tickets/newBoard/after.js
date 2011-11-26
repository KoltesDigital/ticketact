function(e) {
	var elem = $(this);

	db.view(design + '/boards', {
		success: function(resp) {
			var boards = elem.find('#boards');

			$.each(resp.rows, function(i, row) {
				boards.append($('<div/>').text(row.value.name));
			});
		}
	});

	elem.find('#newBoard').submit(function() {
		var form = $(this);

		var name = form.find('[name=name]').val();

		if (name) {
			var board = {
				doctype: 'board',
				name: name,
				description: form.find('[name=description]').val()
			};

			db.saveDoc(board, {
				success: function() {
					$.pathbinder.go('board/' + board._id);
				}
			});
		}

		return false;
	});

	ui();
	elem.find('#newBoard [name=name]').focus();
}