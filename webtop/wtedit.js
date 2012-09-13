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
			
			init : function() {
				
			}
		};
		return app;
	}	
};