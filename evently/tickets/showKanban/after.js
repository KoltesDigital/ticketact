function(e, board, tickets) {
	var elem = $(this);

	var thead = elem.find('#kanban>thead>tr');
	var tbody = elem.find('#kanban>tbody>tr');

	var stages = {};

	function appendStage(stage) {
		var th = $('<th/>');
		th.text(stage);
		thead.append(th);
		
		var td = $('<td class="ticketContainer"/>');
		tbody.append(td);
		
		td.data('stage', stage);
		
		stages[stage] = td;
	}

	function buildTicket(ticket) {
		return $('<a class="ui-corner-all ui-state-default"/>').
			attr('href', '#ticket/' + ticket._id).
			data('ticket', ticket).
			append(
				$('<h2/>').text(ticket.name)
			).append(
				$('<div/>').text(ticket.description)
			);
	}

	var otherTickets = elem.find('#otherTickets');
	
	$.each(board.stages, function(i, stage) {
		appendStage(stage);
	});

	$.each(tickets, function(i, ticket) {
		if (!stages[ticket.stage]) {
			appendStage(ticket.stage);
		}
		stages[ticket.stage].append(buildTicket(ticket));
	});

	elem.find('.ticketContainer').sortable({
		connectWith: '.ticketContainer',
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