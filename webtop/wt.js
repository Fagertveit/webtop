/*
 * WebTop main class.
 * This class will take care of the main components of the WebTop environment
 * such as the Desktop and the portal containers. Might make a new class for the portals though.
 */

var WT = {
	Desk : null,
	
	init : function() {
		this.Desk = new WT.desktop.Desktop();
		this.Desk.init();
		
		WT.Desk.addIcon(WT.gradient.Application);
		WT.Desk.addIcon(WT.wtedit.Application);
	}
};