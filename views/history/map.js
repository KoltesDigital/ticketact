function(doc) {
	switch (doc.doctype) {
	case 'ticket':
		if (doc.assignees) {
			for (var i in doc.assignees) {
				emit([doc.assignees[i].name, doc.assignees[i].date, doc._id, 'assigned'], doc.doctype);
			}
		}
		break;
		
	case 'comment':
		emit([doc.user, doc.date, doc.ticket, 'commented'], doc.doctype);
		break;
	}
}