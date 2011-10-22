function(doc) {
	if (doc.doctype == 'ticket') {
		if (doc.history) {
			for (var i in doc.history) {
				var user = doc.history[i].user;
				if (user) {
					emit(user, null);
				}
			}
		}
	}
	
	if (doc.doctype == 'comment' && doc.user) {
		emit(doc.user, null);
	}
}