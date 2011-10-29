function(e, params) {
	var elem = $(this);

	var tag = (typeof params == 'object') ? (params.tag) : params;

	if (configuration.bugViewETagsIncludeDocs) {
		db.view(design + '/tags', {
			keys: [tag],
			reduce: false,
			success: function(resp) {
				var keys = [];

				$.each(resp.rows, function(i, row) {
					keys.push(row.id);
				});
				
				db.allDocs({
					keys: keys,
					include_docs: true,
					success: function(resp) {
						var placeholder = elem.find('#tickets');
						$.each(resp.rows, function(i, row) {
							placeholder.append($('<div/>').append($('<a/>').attr('href', '#ticket/' + row.id).text(row.doc.name)));
						});
					}
				});
			}
		});
	} else {
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
	}

	ui();
}