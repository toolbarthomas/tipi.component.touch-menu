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
			ready : '__touch-menu--ready',
			active : '__touch-menu--active',
			toggle_ready : '__touch-menu-toggle--ready',
			toggle_active : '__touch-menu-toggle--active',
			drawer_ready : '__touch-menu-drawer--ready',
			drawer_active : '__touch-menu-drawer--active'
		}
	};


	window.setTouchMenu = function()
	{
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
			},
			'tipi.touchMenu.resize' : function(event, elements) {
				checkTouchMenuToggleVisibility(elements);
			}
		});

		var resize;
		$(window).on({
			resize : function()
			{
				clearTimeout(resize);
				resize = setTimeout(function() {
					$(document).trigger('tipi.touchMenu.resize', [{
						toggles : touch_menu_toggle
					}]);
				}, 250);
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
					var toggles = getRelatedTouchMenuToggles(touch_menu_toggle, toggle);

					if(toggles.length === 0)
					{
						return;
					}

					if(toggle.hasClass(data.states.toggle_active))
					{
						$(document).trigger('tipi.touchMenu.close', [{
							toggles : toggles,
							drawer : drawer
						}]);
					}
					else
					{
						$(document).trigger('tipi.touchMenu.open', [{
							toggles : toggles,
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

	function initTouchMenu(elements)
	{
		if(typeof elements === 'undefined')
		{
			return;
		}

		elements.toggle.addClass(data.states.toggle_ready);
		elements.drawer.addClass(data.states.drawer_ready);

		$('html').addClass(data.states.ready);
	}

	function openTouchMenu(elements)
	{
		if(typeof elements === 'undefined')
		{
			return;
		}

		elements.toggles.addClass(data.states.toggle_active);
		elements.drawer.addClass(data.states.drawer_active);

		$('html').addClass(data.states.active);
	}

	function closeTouchMenu(elements)
	{
		if(typeof elements === 'undefined')
		{
			return;
		}

		elements.toggles.removeClass(data.states.toggle_active);
		elements.drawer.removeClass(data.states.drawer_active);

		$('html').removeClass(data.states.active);
	}

	function checkTouchMenuToggleVisibility(elements)
	{
		if(typeof elements === 'undefined')
		{
			return;
		}

		elements.toggles.each(function() {
			var toggle = $(this);
			var toggles = getRelatedTouchMenuToggles(elements.toggles, toggle);
			var drawer = getTouchMenuDrawer(toggle);

			if(drawer.length === 0 || toggles.length === 0)
			{
				return;
			}

			var visible = false;
			toggles.each(function() {
				if($(this).is(':visible'))
				{
					visible = true;
				}
			});


			if(visible)
			{
				return;
			}

			$(document).trigger('tipi.touchMenu.close', [{
				toggles : toggles,
				drawer : drawer
			}]);
		});
	}

	function getRelatedTouchMenuToggles(toggles, toggle)
	{
		var related_toggles = toggle.data(data.attributes.related_toggles);
		if(typeof related_toggles === 'undefined')
		{
			//Create an empty jQuery object where we can add the related toggles
			related_toggles = $();

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

			toggle.data(data.attributes.related_toggles, related_toggles);
		}

		return related_toggles;
	}

	function getTouchMenuDrawer(toggle)
	{
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