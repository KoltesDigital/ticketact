function(doc, req) {
	if (doc.doctype == 'ticket') {
		return (doc.board == req.query.id);
	}
	return false;
}