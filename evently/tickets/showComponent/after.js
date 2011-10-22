function(e, component) {
	setPage('component', [component._id]);
	startPolling({
		filter: design + '/document',
		id: component._id
	});

	ui();
}