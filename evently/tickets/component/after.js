function(e, params) {
	var elem = $(this);

	var id = (typeof params == 'object') ? params.id : params;

	db.openDoc(id, {
		success: function(doc) {
			updateCache('components', doc._id, doc);
			elem.trigger('showComponent', [doc]);
		}
	});
}