function(doc) {
	if (doc.doctype == 'ticket') {
		emit([doc.board, doc.stage], null);
	}
}