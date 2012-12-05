/* WebTop Main
 * ------------
 * This class will hold the main data for WebTop as well as the Desktop class that handles
 * pretty much everything that goes on behind the scenes (Icons, Portals, Applications and
 * settings).
 */
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
				var portal = new WT.portal.Portal(WT.CURRENT_PORTAL_ID, this, "Test");
				portal.init(this.container);
				WT.CURRENT_PORTAL_ID++;
			},
			
			log : function(message) {
				console.log(message);
			}
		};
		return desktop;
	}
};