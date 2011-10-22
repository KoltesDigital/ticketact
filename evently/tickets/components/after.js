function(e) {
	var elem = $(this);

	db.view(design + '/components', {
		success: function(resp) {
			var components = elem.find('#components');
			
			$.each(resp.rows, function(i, row) {
				components.append($('<div/>').append($('<a/>').attr('href', '#component/' + row.id).text(row.value)));
			});
		}
	});

	ui();
}