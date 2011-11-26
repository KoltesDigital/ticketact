function(e) {
	var elem = $(this);
	var tr = elem.tr();

	db.view(design + '/boards', {
		success: function(resp) {
			var boards = elem.find('#boards');

			$.each(resp.rows, function(i, row) {
				boards.append($('<a class="ui-corner-all ui-state-default"/>').attr('href', '#kanban/' + row.id).append(
						$('<h2/>').text(row.value.name)
					).append(
						$('<div/>').text(row.value.description)
					).append(
						$('<a class="button edit" data-icon="edit"/>').attr('href', '#board/' + row.id).text(tr('Edit'))
					)
				);
			});
			
			ui(boards, tr);
		}
	});

	ui();
}