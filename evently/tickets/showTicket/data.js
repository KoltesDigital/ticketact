function(e, ticket, comments, cards) {
	return {
		ticket: ticket,
		cards: cards,
		comments: comments,
		tr: $(this).tr()
	};
}