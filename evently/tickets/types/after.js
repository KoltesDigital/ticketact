function(e) {
	var elem = $(this);

	db.view(design + '/types', {
		success: function(resp) {
			var types = elem.find('#types');

			$.each(resp.rows, function(i, row) {
				types.append($('<div/>').append($('<a/>').attr('href', '#type/' + row.id).text(row.value)));
			});
		}
	});

	ui();
}