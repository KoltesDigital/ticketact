function(e, params) {
	var elem = $(this);

	var id = (typeof params == 'object') ? params.id : params;

	db.openDoc(id, {
		success: function(board) {
			db.view(design + '/ticketsInBoards', {
				startkey: [id],
				endkey: [id, {}],
				reduce: false,
				include_docs: true,
				success: function(resp) {
					var tickets = [];

					$.each(resp.rows, function(i, row) {
						tickets.push(row.doc);
					});

					elem.trigger('showKanban', [board, tickets]);
				}
			});
		}
	});
}