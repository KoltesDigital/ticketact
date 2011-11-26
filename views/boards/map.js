function(doc) {
	if (doc.doctype == 'board') {
		emit(doc._id, {
			name: doc.name,
			description: doc.description,
			color: doc.color
		});
	}
}