function(e, params) {
	var elem = $(this);

	var id = (typeof params == 'object') ? params.id : params;

	if (configuration.bugViewETagsIncludeDocs) {
		db.view(design + '/ticket', {
			startkey: [id],
			endkey: [id, {}],
			success: function(resp) {
				var keys = [];

				$.each(resp.rows, function(i, row) {
					keys.push(row.id);
				});

				db.allDocs({
					keys: keys,
					include_docs: true,
					success: function(resp) {
						var ticket = null;
						var cards = {};
						var comments = [];
			
						$.each(resp.rows, function(i, row) {
							switch (row.doc.doctype) {
								case 'ticket':
									ticket = row.doc;
									break;
			
								case 'card':
									cards[row.doc.user] = row.doc;
									break;
			
								case 'comment':
									comments.push(row.doc);
									break;
							}
						});
			
						if (ticket) {
							elem.trigger('showTicket', [ticket, comments, cards]);
						} else {
							elem.trigger('missing', [id]);
						}
					}
				});
			}
		});
	} else {
		db.view(design + '/ticket', {
			startkey: [id],
			endkey: [id, {}],
			include_docs: true,
			success: function(resp) {
				var ticket = null;
				var cards = {};
				var comments = [];
	
				$.each(resp.rows, function(i, row) {
					switch (row.key[1]) {
						case 'ticket':
							ticket = row.doc;
							break;
	
						case 'card':
							cards[row.doc.user] = row.doc;
							break;
	
						case 'comment':
							comments.push(row.doc);
							break;
					}
				});
	
				if (ticket) {
					elem.trigger('showTicket', [ticket, comments, cards]);
				} else {
					elem.trigger('missing', [id]);
				}
			}
		});
	}
}