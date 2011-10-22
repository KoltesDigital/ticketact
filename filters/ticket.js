function(doc, req) {
	switch (doc.doctype) {
		case 'ticket':
			return (doc._id == req.query.id);
		
		case 'card':
		case 'comment':
			return (doc.ticket == req.query.id);
	}
	return false;
}