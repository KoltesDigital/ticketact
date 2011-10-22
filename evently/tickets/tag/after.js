function(e, params) {
	var elem = $(this);

	var tag = (typeof params == 'object') ? (params.tag) : params;

	db.view(design + '/tags', {
		keys: [tag],
		reduce: false,
		include_docs: true,
		success: function(resp) {
			var placeholder = elem.find('#tickets');
			$.each(resp.rows, function(i, row) {
				placeholder.append($('<div/>').append($('<a/>').attr('href', '#ticket/' + row.id).text(row.value)));
			});
		}
	});

	ui();
}