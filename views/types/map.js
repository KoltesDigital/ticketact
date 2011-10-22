function(doc) {
	if (doc.doctype == 'type') {
		emit(doc._id, doc.name);
	}
}