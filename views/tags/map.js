function(doc) {
	if (doc.doctype == 'ticket' && doc.tags) {
		for (var i in doc.tags) {
			emit(doc.tags[i], doc.name);
		}
	}
}