function(doc) {
	if (doc.doctype == 'version') {
		emit(doc._id, doc.name);
	}
}