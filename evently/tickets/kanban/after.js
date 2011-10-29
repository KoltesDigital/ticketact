function(e, params) {
	var elem = $(this);

	var id = (typeof params == 'object') ? params.id : params;

	db.openDoc(id, {
		success: function(board) {
			if (configuration.bugViewETagsIncludeDocs) {
				db.view(design + '/ticketsInBoards', {
					startkey: [id],
					endkey: [id, {}],
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
								var tickets = [];
								
								$.each(resp.rows, function(i, row) {
									tickets.push(row.doc);
								});
			
								elem.trigger('showKanban', [board, tickets]);
							}
						});
					}
				});
			} else {
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
		}
	});
}