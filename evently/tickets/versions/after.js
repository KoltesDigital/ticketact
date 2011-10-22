function(e) {
	var elem = $(this);

	db.view(design + '/versions', {
		success: function(resp) {
			var versions = elem.find('#versions');
			
			$.each(resp.rows, function(i, row) {
				versions.append($('<div/>').append($('<a/>').attr('href', '#version/' + row.id).text(row.value)));
			});
		}
	});

	ui();
}