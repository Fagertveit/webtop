var WT = {
	DEFAULT_DESK_ID : "wtdesk",
	CURRENT_PORTAL_ID : 0,
	
	Desktop : function(srcWidth, srcHeight) {
		desktop = {
			width : srcWidth || 640,
			height : srcHeight || 480,
			container : null,
			
			init : function() {
				// Test the dom createDiv
				var elem = WT.dom.createDiv(
					{"id" : WT.DEFAULT_DESK_ID, 
					"class" : "desktop"}, 
					{"width" : this.width + "px",
					"height" : this.height + "px",
					"marginTop" : Math.floor(-this.height/2) + "px",
					"marginLeft" : Math.floor(-this.width/2) + "px",
					"top" : "50%",
					"left" : "50%",
					"position" : "fixed",
					"borderStyle" : "solid",
					"borderWidth" : "1px",
					"borderColor" : "#ccc",
					"backgroundColor" : "#eee",
					"overflow" : "hidden"}
				);
				
				this.container = elem;

				document.body.appendChild(elem);
			},
		
			addPortal : function(title, width, height) {
				var portal = new WT.portal.Portal(WT.CURRENT_PORTAL_ID, this.container, "Test");
				portal.init();
				WT.CURRENT_PORTAL_ID++;
			}
		};
		return desktop;
	}
};