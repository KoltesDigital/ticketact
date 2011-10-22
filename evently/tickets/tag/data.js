function(e, params) {
	var tag = (typeof params == 'object') ? (params.tag) : params;

	return {
		tag: tag,
		tr: $(this).tr()
	};
}