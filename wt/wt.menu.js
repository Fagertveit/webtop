/* WebTop - Menu
 * --------------
 * A class that handles menu's and menu items, it will handle tool-bars as well
 * This will be the perfect test space to make event handlers work as I want
 * them to.
 * The general approach is that I create a container for the menu and populate
 * it with menu items that I connect with callback functions.
 * First I need to make a MenuBar, this will in turn be populated with menu's
 * who will be populated with menu items that will have callbacks.
 * The Tool-bar will instead have buttons that is connected with callbacks.
 * 
 * I need to start off with this and then implement additional functionality
 * to the classes, I might want special widgets for the tool-bar, and sub-menues
 * for the menu's.
 * --------------
 * Classes
 * ==============
 * MenuBar
 * ---------
 * This is the top parent for menu systems, it will have menu's as children that
 * will be placed in an array.
 * The menubar needs to have specific metrics.
 * * Height: 20px
 * ---------
 * Menu
 * ---------
 * This is the child of menu-bar, it will have menu items as children, placed
 * in an array.
 * ---------
 * MenuItem
 * ---------
 * This is the child of a menu, it holds a callback reference that will be
 * triggered when the user clicks on the item.
 */
WT.menu = {
	MenuBar : function() {
		var menuBar = {
			parent : null,
			menus : new array(),
			
			init : function() {
				generateMenuBar();
			},
			
			generateMenuBar : function() {
				var mb = WT.dom.createDiv(
					{"id" : "menu_bar-" + this.parent.id,
					"class" : "menu_bar"},
					{"width" : "100%",
					"height" : "22px",
					"backgroundColor" : "#aaa",
					"position" : "absolute",}
				);
			},
			
			addMenu : function() {
				
			},
			
			removeMenu : function() {
				
			}
		};
		return menuBar;
	},	
		
	Menu : function() {
		var menu = {
			parent : null,
			items : new array(),
			
			init : function() {
				
			},
			
			addItem : function() {
				
			},
			
			removeItem : function() {
				
			}
		};
		return menu;
	},
	
	MenuItem : function() {
		var menuItem = {
			parent : null,
			callback : null,
			
			init : function() {
				
			},
			
			setCallback : function(callback) {
				this.callback = callback;
			},
			
			trigger : function() {
				this.callback();
			}
		};
		return menuItem;
	}
};