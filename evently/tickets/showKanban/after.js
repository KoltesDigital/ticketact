function(e, board, tickets) {
	var elem = $(this);

	tickets.sort(function(a, b) {
		return b.importance - a.importance;
	});

	function buildTicket(ticket) {
		var widget = $('<div/>');
		widget.data('ticket', ticket);
		widget.addClass('ui-widget ui-state-default ui-corner-all');

		var header = $('<div/>');
		header.addClass('ui-widget-header');
		widget.append(header);

		var name = $('<a/>');
		name.attr('href', '#ticket/' + ticket._id);
		name.text(ticket.name);
		header.append(name);

		var content = $('<div/>');
		content.addClass('ui-widget-content');
		widget.append(content);

		var description = $('<div/>');
		description.text(ticket.description);
		content.append(description);

		return widget;
	}

	var thead = elem.find('#kanban>thead>tr');
	var tbody = elem.find('#kanban>tbody>tr');

	var stages = {};

	$.each(board.stages, function(i, stage) {
		var th = $('<th/>');
		th.text(stage);
		thead.append(th);

		var td = $('<td/>');
		td.data('stage', stage);
		tbody.append(td);

		stages[stage] = td;
	});

	$.each(tickets, function(i, ticket) {
		var div = buildTicket(ticket);

		if (stages[ticket.stage]) {
			stages[ticket.stage].append(div);
		} else {
			elem.find('#otherTickets').append(div);
		}
	});

	elem.find('td').sortable({
		connectWith: '#kanban td',
		update: function(e, ui) {
			if (ui.sender) {
				var ticket = $(ui.item).data('ticket');
				ticket.stage = ui.item.parent().data('stage');
				db.saveDoc(ticket);
			}
		}
	}).disableSelection();

	setPage('kanban', [board._id]);
	startPolling({
		filter: design + '/kanban',
		id: board._id
	});

	ui();
}