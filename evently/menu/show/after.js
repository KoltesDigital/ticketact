function(e) {
	var currentPath = $.pathbinder.currentPath();
	$(this).find('li>a').button();
	
	ui(this);
}