function(e) {
	var elem = $(this);

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