/* WebTop Toolbar
 * --------------
 * The toolbar object class is much like the menu class, but it has the special purpouse to
 * contain tool items with visual representation (ie. icons) that will be easy to access in
 * a application.
 * The generation of these items is much like menues though.
 */
WT.toolbar = {
	ToolBar : function(srcPar) {
		var toolbar = {
			items : new Array(),
			parent : srcPar,
			hasMenu : true,
			
			init : function() {
				
			},
			
			generateToolBar : function() {
				var container = document.createElement("div");
				container.setAttribute("id", "toolbar-" + this.parent);
				container.setAttribute("class", "toolbar");
				if(this.hasMenu) {
					container.style.top = 16 + "px";
				}
				
				return container;
			},
			
			addTool : function(label) {
				var temp = new WT.toolbar.ToolItem(this.parent, label);
				temp.init();
				
				this.items[label] = temp;
			}
		};
		return toolbar;
	},

	ToolItem : function(srcPar, srcLabel) {
		var item = {
			parent : srcPar,
			label : srcLabel,
			action : null,
			
			init : function() {
				this.generateToolItem();
			},
			
			generateToolItem : function() {
				var parent = document.getElementById("toolbar-" + this.parent);
				var icon = document.createElement("div");
				
				icon.setAttribute("id", "toolitem-" + this.label + "-" + this.parent);
				icon.setAttribute("parent", this.parent);
				icon.setAttribute("label", this.label);
				icon.setAttribute("class", "toolitem");
				icon.addEventListener("click", this.clickItem, true);
				
				parent.appendChild(icon);
			},
			
			setIcon : function(src) {
				var icon = document.getElementById("toolitem-" + this.label + "-" + this.parent);
				
				icon.style.backgroundImage = "url(" + src + ")";
				icon.style.backgroundRepeat = "no-repeat";
				icon.style.backgroundPosition = "center";
			},
			
			setAction : function(action) {
				this.action = action;
			},
			
			clickItem : function(event) {
				var target = event.target;
				var parent = target.getAttribute("parent");
				var label = target.getAttribute("label");
				
				var item = WT.Desk.applications[parent].toolbar.items[label];
				
				item.action(event);
			}
		};
		return item;
	}
};