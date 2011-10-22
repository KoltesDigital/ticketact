function(e) {
	var elem = $(this);

	db.view(design + '/tags', {
		group: true,
		success: function(resp) {
			var placeholder = elem.find('#tags');
			$.each(resp.rows, function(i, row) {
				placeholder.append($('<div/>').text(' (' + row.value + ')').prepend($('<a/>').attr('href', '#tag/' + row.key).text(row.key)));
			});
		}
	});

	ui();
}