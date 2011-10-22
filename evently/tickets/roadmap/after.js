function(e, params) {
	var elem = $(this);

	var id = (typeof params == 'object') ? ('version/' + params.version) : params;

	db.openDoc(id, {
		success: function(version) {
			db.view(design + '/ticketsInVersions', {
				startkey: [id],
				endkey: [id, {}],
				reduce: false,
				include_docs: true,
				success: function(resp) {
					var tickets = [[], []];

					$.each(resp.rows, function(i, pair) {
						var type = pair.key[1];
						tickets[type].push(pair.doc);
					});

					elem.trigger('showRoadmap', [version, tickets]);
				}
			});
		}
	});
}