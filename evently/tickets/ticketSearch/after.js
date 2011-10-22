function(e) {
	var elem = $(this);

	db.view(design + '/tickets', {
		success: function(resp) {
			var tickets = elem.find('#tickets');

			$.each(resp.rows, function(i, row) {
				var div = $('<div/>');

				var link = $('<a/>');
				link.attr('href', '#ticket/' + row.id);
				link.text(row.key);
				div.append(link);

				tickets.append(div);
			});
		}
	});

	ui();
}