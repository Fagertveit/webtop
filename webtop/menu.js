/* WebTop Menu
 * -----------
 * This is a general object class for menus and menu items that populates them. This
 * is made to make menu generation a wee bit easier and to put an abstractionlevel to
 * menu items.
 * The items are created much like elements are created in the DOM and given event
 * listeners from the main application class.
 * The menu will be able to contain a mix of items with icons and checkboxes.
 */
WT.menu = {
	/* MenuBar
	 * The menubar is the main container for menus and menu items, this is the class that
	 * is used by the application.
	 */
	MenuBar : function(parId) {
		var menubar = {
			parent : parId,
			menus : new Array(),
				
			init : function() {
				
			},
		
			generateMenuBar : function() {
				var container = document.createElement("div");
				container.setAttribute("class", "menubar");
				container.setAttribute("id", "menubar-" + this.parent);
				
				return container;
			},
			
			addMenu : function(label) {
				var temp = new WT.menu.Menu(label, this.parent);
				temp.init();
				
				this.menus[label] = temp;
			},
			
			hideAll : function() {
				for(menu in this.menus) {
					WT.Desk.applications[this.parent].menu.menus[menu].hideMenu();
				}
			}
		};
		return menubar;
	},	
	
	/* Menu
	 * The main menu
	 */
	Menu : function(srcLabel, srcPar) {
		var menu = {
			parent : srcPar,
			label : srcLabel,
			menuItems : new Array(),
			visible : false,
			
			init : function() {
				this.generateMenu();
			},
			
			generateMenu : function() {
				var parentElem = document.getElementById("menubar-" + this.parent);
				var label = document.createElement("div");
				var container = document.createElement("div");
				var menuHandle = document.createElement("div");
				
				label.innerHTML = this.label;
				label.setAttribute("class", "menulabel");
				label.setAttribute("id", "menulabel-" + this.label + "-" + this.parent);
				label.setAttribute("parent", this.parent);
				label.addEventListener("click", this.toggleMenu, true);
				
				menuHandle.setAttribute("id", "menuhandle-" + this.label + "-" + this.parent);
				menuHandle.setAttribute("parent", this.parent);
				menuHandle.setAttribute("type", "menu");
				menuHandle.style.height = 16 + "px";
				menuHandle.style.width = "100%";
				menuHandle.style.position = "absolute";
				menuHandle.style.top = 0 + "px";
				menuHandle.style.left = 0 + "px";
				menuHandle.addEventListener("click", this.toggleMenu, true);
				
				container.setAttribute("class", "menu");
				container.setAttribute("id", "menu-" + this.label + "-" + this.parent);
				container.style.display = "none";
				
				label.appendChild(menuHandle);
				menuHandle.appendChild(container);
				parentElem.appendChild(label);
			},
			
			addMenuItem : function(label) {
				var temp = new WT.menu.MenuItem(label, this.label, this.parent);
				temp.init();
				
				this.menuItems[label] = temp;
			},
			
			setWidth : function(width) {
				var container = document.getElementById("menu-" + this.label + "-" + this.parent);
				container.style.width = width + "px";
			},
			
			toggleMenu : function(event) {
				var target = event.target;
				var child = target.childNodes;
				var parent = target.getAttribute("parent");
				
				if(target.getAttribute("type") == "menu") {
					WT.Desk.applications[parent].menu.hideAll();
					
					if(this.visible == false) {
						child[0].style.display = "block";
						this.visible = true;
					} else {
						this.visible = false;
					}
				}
			},
			
			hideMenu : function() {
				var container = document.getElementById("menu-" + this.label + "-" + this.parent);
				container.style.display = "none";
			}
		};
		return menu;
	},
	
	MenuItem : function(srcLabel, srcCont, srcPar) {
		var item = {
			parent : srcPar,
			container : srcCont,
			label : srcLabel,
			action : null,
			
			init : function() {
				this.generateMenuItem();
			},
		
			generateMenuItem : function() {
				var parentElem = document.getElementById("menu-" + this.container + "-" + this.parent);
				var label = document.createElement("div");
				var handle = document.createElement("div");
				
				label.innerHTML = this.label;
				label.setAttribute("class", "menuitem");
				label.setAttribute("id", "menuitem-" + this.label + "-" + this.parent);
				
				handle.setAttribute("id", "itemhandle-" + this.label + "-" + this.parent);
				handle.setAttribute("parent", this.parent);
				handle.setAttribute("type", "item");
				handle.setAttribute("label", this.label);
				handle.setAttribute("container", this.container);
				handle.style.height = 16 + "px";
				handle.style.width = "100%";
				handle.style.position = "absolute";
				handle.style.top = 0 + "px";
				handle.style.left = 0 + "px";
				handle.addEventListener("click", this.clickItem, true);

				parentElem.appendChild(label);
				label.appendChild(handle);
			},
			
			setAction : function(action) {
				this.action = action;
			},
			
			clickItem : function(event) {
				var target = event.target;
				var parent = target.getAttribute("parent");
				var label = target.getAttribute("label");
				var container = target.getAttribute("container");
				
				console.log("Clicked: " + label + " in menu " + container + " with the parent " + parent);
				
				var menuItem = WT.Desk.applications[parent].menu.menus[container].menuItems[label];
				
				menuItem.action("Clicked " + label + "!");
			}
		};
		return item;
	},
	
	SubMenu : function() {
		var sub = {
			parent : srcPar,
			items : new Array(),
			
			init : function() {
				
			}
		};
		return sub;
	}
};