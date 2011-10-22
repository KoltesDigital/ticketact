function(e, params) {
	var elem = $(this);

	var id = (typeof params == 'object') ? params.id : params;

	db.openDoc(id, {
		success: function(doc) {
			updateCache('boards', doc._id, doc);
			elem.trigger('showBoard', [doc]);
		}
	});
}