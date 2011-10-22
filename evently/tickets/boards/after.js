function(e) {
	var elem = $(this);

	db.view(design + '/boards', {
		success: function(resp) {
			var boards = elem.find('#boards');

			$.each(resp.rows, function(i, row) {
				boards.append($('<div/>').append($('<a/>').attr('href', '#board/' + row.id).text(row.value)));
			});
		}
	});

	ui();
}