function(doc) {
	switch (doc.doctype) {
	case 'ticket':
		emit([doc._id, 'ticket', doc.createdOn], null);
		break;
		
	case 'card':
		emit([doc.ticket, 'card', doc.date], null);
		break;
		
	case 'comment':
		emit([doc.ticket, 'comment', doc.date], null);
		break;
	}
}