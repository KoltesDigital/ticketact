function(doc) {
	if (doc.doctype == 'board') {
		emit(doc._id, doc.name);
	}
}