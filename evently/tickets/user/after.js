function(e, params) {
	var elem = $(this);

	var user = (typeof params == 'object') ? (params.user) : params;

	db.view(design + '/history', {
		endkey: [user],
		startkey: [user, {}],
		descending: true,
		success: function(resp) {
			var history = elem.find('#history');

			$.each(resp.rows, function(i, pair) {
				history.append($('<div/>').append($('<a/>').attr('href', '#' + row.value + '/' + row.id).text(row.value)));
			});
		}
	});

	ui();
}