(function(win, doc, $) {
	var data = {
		elements : {
			toggle : 'touch-menu-toggle',
			drawer : 'touch-menu-drawer',
			helper : 'touch-menu-document-helper',
			helperWrapper : 'touch-menu-document-helper-wrapper'
		},
		attributes : {
			drawer : 'touch-menu-drawer',
			related_toggles : 'touch-menu-related-toggles',
			registered_drawer : 'touch-menu-registered-drawer'
		},
		states : {
			toggle_ready : '__touch-menu-toggle--ready',
			toggle_active : '__touch-menu-toggle--active',
			drawer_ready : '__touch-menu-drawer--ready',
			drawer_active : '__touch-menu-drawer--active'
		}
	};


	window.setTouchMenu = function() {
		var touch_menu_toggle = $('.' + data.elements.toggle).not(data.states.toggle_ready);

		$(document).on({
			'tipi.touchMenu.init' : function(event, elements) {
				initTouchMenu(elements);
			},
			'tipi.touchMenu.open' : function(event, elements) {
				openTouchMenu(elements);
			},
			'tipi.touchMenu.close' : function(event, elements) {
				closeTouchMenu(elements);
			}
		});

		$(window).on({
			scroll : function() {
				console.log('aa');
			}
		});

		touch_menu_toggle.each(function() {
			var toggle = $(this);

			var drawer = getTouchMenuDrawer(toggle);
			if(drawer.length === 0)
			{
				return;
			}

			//Add the drawer to it's attributes so we activate all toggles withing the page
			toggle.data(data.attributes.registered_drawer, drawer);

			toggle.on({
				click : function(event) {
					event.preventDefault();

					var toggle = $(this);

					var toggles = toggle.data(data.attributes.related_toggles);
					if(typeof toggles === 'undefined')
					{
						toggles = getRelatedTouchMenuToggles(touch_menu_toggle, toggle);

						toggle.data(data.attributes.related_toggles, toggles);
					}

					if(toggle.hasClass(data.states.toggle_active))
					{
						$(document).trigger('tipi.touchMenu.close', [{
							toggle : toggles,
							drawer : drawer
						}]);
					}
					else
					{
						$(document).trigger('tipi.touchMenu.open', [{
							toggle : toggles,
							drawer : drawer
						}]);
					}

				}
			});

			$(document).trigger('tipi.touchMenu.init', [{
				toggle : toggle,
				drawer : drawer
			}]);
		});
	}

	function initTouchMenu(elements) {
		if(typeof elements === 'undefined')
		{
			return;
		}

		elements.toggle.addClass(data.states.toggle_ready);
		elements.drawer.addClass(data.states.drawer_ready);
	}

	function openTouchMenu(elements) {
		if(typeof elements === 'undefined')
		{
			return;
		}

		elements.toggle.addClass(data.states.toggle_active);
		elements.drawer.addClass(data.states.drawer_active);
	}

	function closeTouchMenu(elements) {
		if(typeof elements === 'undefined')
		{
			return;
		}

		elements.toggle.removeClass(data.states.toggle_active);
		elements.drawer.removeClass(data.states.drawer_active);
	}

	function getRelatedTouchMenuToggles(toggles, toggle)
	{
		//Create an empty jQuery object where we can add the related toggles
		var related_toggles = $();

		//Get the registered drawer we've added previously
		var registered_drawer = toggle.data(data.attributes.registered_drawer);
		if(typeof registered_drawer === 'undefined')
		{
			related_toggles = related_toggles.add(toggle);
		}
		else
		{
			toggles.each(function() {
				var current_toggle = $(this);
				var current_registered_drawer = current_toggle.data(data.attributes.registered_drawer);

				if(!registered_drawer.is(current_registered_drawer))
				{
					return;
				}

				related_toggles = related_toggles.add(current_toggle);
			});
		}

		return related_toggles;
	}

	function getTouchMenuDrawer(toggle) {
		if(typeof toggle === 'undefined')
		{
			return;
		}

		if(toggle.length === 0)
		{
			return;
		}

		//Set the default output
		var drawer = $('.' + data.elements.drawer);
		var filter = toggle.data(data.attributes.drawer);

		if(typeof filter === 'undefined') {
			drawer = drawer.first();
		}
		else {
			drawer = drawer.filter(filter).first();
		}

		return drawer;
	}

})( window.jQuery(window), window.jQuery(document), window.jQuery);