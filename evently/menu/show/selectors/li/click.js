function() {
	$.pathbinder.go($(this).children('a').attr('href').substr(1));
	return false;
}