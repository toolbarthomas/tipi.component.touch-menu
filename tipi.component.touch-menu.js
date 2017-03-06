(function(win, doc, $) {
	var data = {
		elements : {
			toggle : 'touch-menu-toggle',
			drawer : 'touch-menu-drawer',
			helper : 'touch-menu-document-helper',
			helperWrapper : 'touch-menu-document-helper-wrapper'
		},
		attributes : {
			drawer : 'touch-menu-drawer'
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

		touch_menu_toggle.each(function() {
			var touch_menu_toggle = $(this);

			var touch_menu_drawer = getTouchMenuDrawer(touch_menu_toggle);
			if(touch_menu_drawer.length === 0)
			{
				return;
			}

			touch_menu_toggle.on({
				click : function(event) {
					event.preventDefault();

					if(touch_menu_toggle.hasClass(data.states.toggle_active))
					{
						$(document).trigger('tipi.touchMenu.close', [touch_menu_toggle, touch_menu_drawer]);
					}
					else
					{
						$(document).trigger('tipi.touchMenu.open', [touch_menu_toggle, touch_menu_drawer]);
					}

				}
			});

			touch_menu_toggle.addClass(data.states.toggle_ready);
			touch_menu_drawer.addClass(data.states.drawer_ready);
		});

		$(document).on({
			'tipi.touchMenu.open' : function(event, toggle, drawer) {
				toggle.addClass(data.states.toggle_active);
				drawer.removeClass(data.states.toggle_active);
			},
			'tipi.touchMenu.close' : function(event, toggle, drawer) {
				toggle.removeClass(data.states.toggle_active);
				drawer.removeClass(data.states.toggle_active);
			}
		});
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

		var output = {
			length : 0
		};

		var drawer = toggle.data(data.attributes.drawer);
		if(typeof drawer === 'undefined') {
			drawer = $('.' + data.elements.drawer);
		}
		else {
			drawer = $(drawer);
		}

		if(drawer.length > 0)
		{
			output = drawer;
		}

		return output;
	}

})( window.jQuery(window), window.jQuery(document), window.jQuery);