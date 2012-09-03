WT.desktop = {
	Desktop : function(srcW, srcH, color) {
		desktop = {
			width : srcW || 640,
			height : srcH || 480,
			background : color || [ 245, 245, 245 ],
			portals : new Array(),
			applications : new Array(),
			nextId : 0,
			deskId : "desk-cont",

			init : function() {
				var container = document.createElement("div");
				container.setAttribute("id", this.deskId);
				container.setAttribute("class", "desktop");
				container.style.marginTop = "-" + (this.height / 2) + "px";
				container.style.marginLeft = "-" + (this.width / 2) + "px";
				container.style.width = this.width + "px";
				container.style.height = this.height + "px";

				document.body.appendChild(container);
			},

			addPortal : function(height, width) {
				var tempPortal = new WT.portal.Portal(width, height, this.deskId, this.nextId);
				this.nextId++;
				
				this.portals.push(tempPortal);
				
				this.portals[this.portals.length-1].init();
			},
			
			addApplication : function(application) {
				var tempApp = new application(this.nextId);
				var tempPortal = new WT.portal.Portal(tempApp.width, tempApp.weight, this.deskId, this.nextId);
				
				
				this.portals[this.nextId] = tempPortal;
				this.applications[this.nextId] = tempApp;
				
				this.portals[this.nextId].setTitle(tempApp.title);
				this.portals[this.nextId].init();
				this.applications[this.nextId].init();
				
				this.nextId++;
			}
		};
		return desktop;
	},
};