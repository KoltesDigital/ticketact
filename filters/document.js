function(doc, req) {
	return (doc._id == req.query.id);
}