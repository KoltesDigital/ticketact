function(doc) {
	if (doc.doctype == 'ticket') {
		for (var i in doc.concernedVersions) {
			emit([ doc.concernedVersions[i], 0 ], null);
		}

		for (var i in doc.targetVersions) {
			emit([ doc.targetVersions[i], 1 ], null);
		}
	}
}