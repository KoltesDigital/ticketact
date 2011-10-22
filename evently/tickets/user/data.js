function(e, params) {
	var user = (typeof params == 'object') ? (params.user) : params;

	return {
		user: user,
		tr: $(this).tr()
	};
}