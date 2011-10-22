function(doc) {
	if (doc.doctype == 'component') {
		emit(doc._id, doc.name);
	}
}