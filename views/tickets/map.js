function(doc) {
	if (doc.doctype == 'ticket') {
		emit(doc.name, null);
	}
}