/*
 * WebTop main class.
 * This class will take care of the main components of the WebTop environment
 * such as the Desktop and the portal containers. Might make a new class for the portals though.
 */

var WT = {
	Desk : null,
	
	init : function() {
		var browser = "Browser Information:\n";
		for(var propname in navigator) {
			browser += propname + ": " + navigator[propname] + "\n";
		}
		
		console.log(browser);
		
		this.Desk = new WT.desktop.Desktop();
		this.Desk.init();
	}
};