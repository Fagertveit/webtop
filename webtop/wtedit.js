/* WebTop WtEdit
 * -------------
 * WtEdit is WebTops basic text editor! This will be a very good lesson for me to
 * make a WYSIWYG like text editor that I can use in future projects as well.
 * I also need this to display text based projects
 * 
 * 
 */
WT.wtedit = {
	Application : function(parId) {
		var app = {
			parent : parId,
			portalSettings : { width : 256, height : 208, fixed : false, footer : true, title : "WtEdit 0.1"},
			iconSettings : { img : "img/wt-icon-gradient.png", app : WT.gradient.Application, title : "WtEdit" },
			menu : new WT.menu.MenuBar(parId),
			
			init : function() {
				this.generateContainer();
			},
			
			generateContainer : function() {
				var container = document.createElement("div");
				var parentElem = document.getElementById("portal-container-" + this.parent);
				var textInput = document.createElement("textarea");
				container.setAttribute("id", "wtedit-container-" + this.parent);
				container.setAttribute("class", "wtedit-container");
				
				textInput.setAttribute("id", "wtedit-textarea-" + this.parent);
				textInput.setAttribute("class", "wtedit-textarea");
				
				container.appendChild(textInput);
				
				parentElem.appendChild(this.menu.generateMenuBar());
				parentElem.appendChild(container);
			}
		};
		return app;
	}	
};