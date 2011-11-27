function(e, ticket, comments, cards) {
	var elem = $(this);
	var tr = elem.tr();

	function showTicket() {
		elem.trigger('showTicket', [ticket, comments, cards]);
	}

	function saveTicket() {
		stopPolling();

		db.saveDoc(ticket, {
			success: showTicket
		});
	}

	elem.find('#information').edit(function() {
		var form = $(this);

		form.find('[name=name]').val(ticket.name);
		form.find('[name=description]').val(ticket.description);
	}).submit(function() {
		var form = $(this);

		ticket.name = form.find('[name=name]').val();
		ticket.description = form.find('[name=description]').val();

		saveTicket();

		return false;
	});

	elem.find('#addComment [name=text]').change(stopPolling);
	
	elem.find('#addComment').submit(function() {
		var form = $(this);

		var text = form.find('[name=text]').val();

		if (text != '') {
			var comment = {
				doctype: 'comment',
				ticket: ticket._id,
				date: now(),
				user: userCtx.name,
				text: text
			};

			db.saveDoc(comment, {
				success: reloadPage
			});
		}

		return false;
	});

	elem.find('#details').each(function() {
		var form = $(this);

		var boardSelect = form.find('[name=board]');
		boardSelect.change(function() {
			var stageSelect = form.find('[name=stage]');
			if (stageSelect.is('select')) {
				stageSelect.empty();
			} else {
				var newStageSelect = $('<select/>');
				newStageSelect.change(editableSelectChange);
				stageSelect.after(newStageSelect).remove();
				stageSelect = newStageSelect;
				stageSelect.attr('name', 'stage');
			}

			var board = boardSelect.val();
			if (cache.boards[board]) {
				$.each(cache.boards[board].stages, function(i, stage) {
					stageSelect.append($('<option/>').attr('value', stage).text(stage));
				});
				stageSelect.append($('<option/>').text(tr('...')));
				if (board == ticket.board) {
					stageSelect.val(ticket.stage);
				}
			} else {
				stageSelect.change();
			}
		});

 		form.find('[name=tags]').keydown(autocompleteKeydown)
 			.autocomplete({
 				minLength: 0,
 				source: function(request, response) {
 					response($.ui.autocomplete.filter(cache.tags, listToArrayNull(request.term).pop()));
 				},
 				focus: function() {
 					return false;
 				},
 				select: function(event, ui) {
 					var terms = listToArrayNull(this.value);
 					terms.pop();
 					terms.push(ui.item.value);
 					terms.push('');
 					this.value = terms.join(', ');
 					return false;
 				}
 			});
 		
	}).edit(function() {
		var form = $(this);
		stopPolling();

		var typeSelect = form.find('[name=type]');
		typeSelect.empty();
		typeSelect.append($('<option/>').attr('value', '').text(tr('None')));
		$.each(cache.types, function(i, type) {
			typeSelect.append($('<option/>').attr('value', i).text(type.name));
		});
		typeSelect.append($('<option/>').text(tr('...')));
		if (ticket.type) {
			typeSelect.val(ticket.type);
		}

		var componentSelect = form.find('[name=component]');
		componentSelect.empty();
		componentSelect.append($('<option/>').attr('value', '').text(tr('None')));
		$.each(cache.components, function(i, component) {
			componentSelect.append($('<option/>').attr('value', i).text(component.name));
		});
		componentSelect.append($('<option/>').text(tr('...')));
		if (ticket.component) {
			componentSelect.val(ticket.component);
		}

		if (ticket.tags) {
			form.find('[name=tags]').val(ticket.tags.join(', '));
		}

		if (ticket.concernedVersions) {
			form.find('[name=concernedVersions]').val(ticket.concernedVersions.join(', '));
		}

		if (ticket.targetVersions) {
			form.find('[name=targetVersions]').val(ticket.targetVersions.join(', '));
		}

		var boardSelect = form.find('[name=board]');
		boardSelect.empty();
		$.each(cache.boards, function(i, board) {
			boardSelect.append($('<option/>').attr('value', i).text(board.name));
		});
		boardSelect.append($('<option/>').text(tr('...')));
		boardSelect.val(ticket.board);

		var assigneeSelect = form.find('[name=assignee]');
		assigneeSelect.show();
		assigneeSelect.empty();
		assigneeSelect.append($('<option/>').attr('value', '').text(tr('None')));
		$.each(cache.users, function(i, user) {
			assigneeSelect.append($('<option/>').text(user));
		});
		assigneeSelect.append($('<option/>').text(tr('...')));
		if (ticket.assignee) {
			assigneeSelect.val(ticket.assignee);
		}

		var stageSelect = form.find('[name=stage]');
		stageSelect.empty();
		boardSelect.change();

		form.find('[name=estimation]').val(ticket.estimation);
		form.find('[name=duration]').val(ticket.duration);
	}).submit(function() {
		var form = $(this);

		ticket.type = form.find('[name=type]').val() || undefined;
		ticket.component = form.find('[name=component]').val() || undefined;

		var tags = listToArray(form.find('[name=tags]').val());
		if (tags.length > 0) {
			tags.sort(caseInsensitiveSortOrder);
			addTagsToCache(tags);
			ticket.tags = tags;
		} else {
			delete ticket.tags;
		}

		ticket.concernedVersions = listToArray(form.find('[name=concernedVersions]').val());
		if (ticket.concernedVersions.length == 0) {
			delete ticket.concernedVersions;
		}

		ticket.targetVersions = listToArray(form.find('[name=targetVersions]').val());
		if (ticket.targetVersions.length == 0) {
			delete ticket.targetVersions;
		}

		var board = form.find('[name=board]').val();
		var stage = form.find('[name=stage]').val();
		var assignee = form.find('[name=assignee]').val() || null;

		if (board != ticket.board || stage != ticket.stage || assignee != ticket.assignee) {
			ticket.board = board;
			ticket.stage = stage;
			ticket.assignee = assignee;

			historyEntry = {
				date: now(),
				board: board,
				stage: stage
			};
			if (assignee) {
				historyEntry.user = assignee;
			}

			if (ticket.history) {
				ticket.history.push(historyEntry);
			} else {
				ticket.history = [historyEntry];
			}

			addUserToCache(assignee);
		}

		ticket.estimation = calculate(form.find('[name=estimation]').val());
		ticket.duration = calculate(form.find('[name=duration]').val());

		db.saveDoc(ticket, {
			success: showTicket
		});

		return false;
	});

	if (configuration.pokerCards) {
		var poker = elem.find('#poker');
		var pokerContainer = elem.find('#pokerContainer');
	
		function removeCards(callback) {
			stopPolling();
	
			var docs = [];
	
			$.each(cards, function(i, card) {
				docs.push(card);
			});
	
			db.bulkRemove({
				docs: docs
			}, {
				success: function() {
					cards = {};
					callback();
				}
			});
		}
	
		if (userCtx.name && cards[userCtx.name] || !ticket.poker) {
			var cardCount = {};
			for (var i in cards) {
				var card = cards[i].card;
				cardCount[card] = (cardCount[card] || 0) + 1;
				pokerContainer.append($('<div/>').text(tr('&user has played &card on &date.', {
					user: i,
					card: card,
					date: formatDate(cards[i].date)
				})));
			}
			var countResults = [];
			for (var i in cardCount) {
				countResults.push({
					card: i,
					count: cardCount[i]
				});
			}
			if (countResults.length > 0) {
				countResults.sort(function(a, b) {
					return b.count - a.count;
				});
				pokerContainer.append($('<div/>').text(tr('Results:')));
				for (var i in countResults) {
					pokerContainer.append($('<div/>').text(tr('&card (&count)', countResults[i])));
				}
			}
		}
	
		if (ticket.poker) {
			if (!userCtx.name) {
				pokerContainer.append($('<div/>').text(tr('Poker is being played, log in to play.')));
			} else if (!cards[userCtx.name]) {
				function click() {
					var card = {
						doctype: 'card',
						ticket: ticket._id,
						date: now(),
						user: userCtx.name,
						card: $(this).text()
					};
	
					db.saveDoc(card, {
						success: reloadPage
					});
				}
	
				for (var i in configuration.pokerCards) {
					pokerContainer.append($('<button type="button"/>').text(configuration.pokerCards[i]).click(click));
				}
				pokerContainer.append('<br/>');
			}
			if (userCtx.name == ticket.dealer) {
				var redeal = $('<button type="button" name="redeal" data-icon="redeal"/>').text(tr('Redeal'));
				redeal.click(function() {
					removeCards(showTicket);
				});
				pokerContainer.append(redeal);
	
				var stop = $('<button type="button" name="stop" data-icon="stop"/>').text(tr('Stop'));
				stop.click(function() {
					delete ticket.poker;
					saveTicket();
				});
				pokerContainer.append(stop);
			}
		} else if (userCtx.name) {
			var deal = $('<button type="button" name="deal" data-icon="deal"/>').text(tr('Deal'));
			deal.click(function() {
				removeCards(function() {
					ticket.poker = true;
					ticket.dealer = userCtx.name;
					saveTicket();
				});
			});
			pokerContainer.append(deal);
	
			if (ticket.dealer == userCtx.name) {
				var resume = $('<button type="button" name="resume" data-icon="resume"/>').text(tr('Resume'));
				resume.click(function() {
					ticket.poker = true;
					saveTicket();
				});
				pokerContainer.append(resume);
			}
		} else {
			pokerContainer.append($('<div/>').text(tr('Log in to deal.')));
		}
	}

	if (ticket.history) {
		var historyBody = elem.find('#history > tbody');
		$.each(ticket.history, function(i, entry) {
			var tr = $('<tr/>');
			tr.append($('<td/>').text(formatDate(entry.date)));
			if (cache.boards[entry.board]) {
				tr.append($('<td/>').append($('<a/>').attr('href', '#board/' + entry.board).text(cache.boards[entry.board].name)));
			} else {
				tr.append($('<td/>').text(entry.board));
			}
			tr.append($('<td/>').text(entry.stage || ''));
			if (entry.user) {
				tr.append($('<td/>').append($('<a/>').attr('href', '#user/' + entry.user).text(entry.user)));
			} else {
				tr.append($('<td/>'));
			}
			historyBody.append(tr);
		});
	}

	elem.find('#delete').click(function() {
		if (confirm(tr('Confirm ticket deletion.'))) {
			var docs = [ticket].concat(comments);

			$.each(cards, function(i, card) {
				docs.push(card);
			});

			db.bulkRemove({
				docs: docs
			}, {
				success: function() {
					$.pathbinder.go('home');
				}
			});
		}
	});

	setPage('ticket', [ticket._id]);
	startPolling({
		filter: design + '/ticket',
		id: ticket._id
	});

	ui();
	elem.find('#addComment [name=text]').focus();
}