function(e, type) {
	var elem = $(this);

	elem.find('#favoriteBoard select[name=board]').val(type.favoriteBoard);

	elem.find('#favoriteBoard').submit(function() {
		type.favoriteBoard = $(this).find('[name=board]').val();

		db.saveDoc(type, {
			success: function() {
				elem.trigger('type', [type._id]);
			}
		});

		return false;
	});

	setPage('type', [type._id]);
	startPolling({
		filter: design + '/document',
		id: type._id
	});

	ui();
	elem.find('#favoriteBoard select[name=board]').focus();
}