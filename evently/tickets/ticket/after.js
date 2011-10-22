function(e, params) {
	var elem = $(this);

	var id = (typeof params == 'object') ? params.id : params;

	db.view(design + '/ticket', {
		startkey: [id],
		endkey: [id, {}],
		include_docs: true,
		success: function(resp) {
			var ticket = null;
			var cards = {};
			var comments = [];

			$.each(resp.rows, function(i, pair) {
				switch (pair.key[1]) {
					case 'ticket':
						ticket = pair.doc;
						break;

					case 'card':
						cards[pair.doc.user] = pair.doc;
						break;

					case 'comment':
						comments.push(pair.doc);
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