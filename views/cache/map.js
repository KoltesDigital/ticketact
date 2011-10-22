function(doc) {
	switch (doc.doctype) {
	case 'board':
		emit('board', {
			_id : doc._id,
			name : doc.name,
			stages : doc.stages
		});
		break;
		
	case 'component':
		emit('component', {
			_id : doc._id,
			name : doc.name
		});
		break;
		
	case 'type':
		emit('type', {
			_id : doc._id,
			name : doc.name,
			favoriteBoard : doc.favoriteBoard
		});
		break;
		
	case 'version':
		emit('version', {
			_id : doc._id,
			name : doc.name
		});
		break;
	}
}