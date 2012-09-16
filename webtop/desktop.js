/* WebTop Desktop
 * --------------
 * The Desktop object holds reference to everything that is happening in the webtop system, except sublevel
 * that has portals and such as parents.
 * It's a little blury how the system will work, but I will plan this out as I go along with the general
 * development of the WebTop environment.
 * 
 */

WT.desktop = {
	Desktop : function(srcW, srcH, color) {
		var desktop = {
			width : srcW || 640,
			height : srcH || 480,
			background : color || [ 245, 245, 245 ],
			icons : new Array(),
			portals : new Array(),
			applications : new Array(),
			nextIcon : 0,
			nextId : 0,
			deskId : "desk-cont",
			nextZIndex : 10,

			init : function() {
				var container = document.createElement("div");
				if(document.width) {
					var width = document.width - 20;
					var height = document.height - 20;
				} else {
					var width = document.documentElement.scrollWidth - 20;
					var height = document.documentElement.scrollHeight - 20;
				}
				
				
				container.setAttribute("id", this.deskId);
				container.setAttribute("class", "desktop");
				container.style.marginTop = "-" + (height / 2) + "px";
				container.style.marginLeft = "-" + (width / 2) + "px";
				container.style.width = width + "px";
				container.style.height = height + "px";

				document.body.appendChild(container);
			},

			addPortal : function(height, width) {
				var tempPortal = new WT.portal.Portal(width, height, WT.Desk.deskId, WT.Desk.nextId);
				WT.Desk.nextId++;
				
				WT.Desk.portals.push(tempPortal);
				
				WT.Desk.portals[WT.Desk.portals.length-1].init();
			},
			
			addApplication : function(application) {
				var tempApp = new application(WT.Desk.nextId);
				var settings = tempApp.portalSettings;
				var tempPortal = new WT.portal.Portal(settings.width, settings.height, WT.Desk.deskId, WT.Desk.nextId, settings.fixed, settings.footer, settings.title);
				var container;
				
				WT.Desk.portals[WT.Desk.nextId] = tempPortal;
				WT.Desk.applications[WT.Desk.nextId] = tempApp;
				
				WT.Desk.portals[WT.Desk.nextId].init();
				WT.Desk.applications[WT.Desk.nextId].init();
				//WT.Desk.portals[WT.Desk.nextId].setZIndex(WT.Desk.nextZIndex);
				container = document.getElementById("portal-" + WT.Desk.nextId);
				container.style.zIndex = WT.Desk.nextZIndex;
				
				WT.Desk.nextZIndex += 10;
				WT.Desk.nextId++;
			},
			
			addIcon : function(application) {
				var tempApp = new application(9999);
				var settings = tempApp.iconSettings;
				var icon = new WT.icon.Icon(settings.img, [0, 3 + WT.Desk.nextIcon], application, settings.title, WT.Desk.deskId, WT.Desk.nextIcon);
				
				icon.init();
				WT.Desk.icons[WT.Desk.nextIcon] = icon;
				WT.Desk.nextIcon++;
			},
			
			moveToFront : function(e) {
				var target = e.target;
				var targetNode = false;
				var id = 0;
				var container;
				while(!targetNode) {
					target = target.parentNode;
					if(target.hasAttribute("portalid")) {
						id = new Number(target.getAttribute("portalid"));
						targetNode = true;
						break;
					}
				}
				// Need to check the "hasAttribute" and make a tree search till we find
				// the node that has the attribute we need (portalid)
				// while()
				var zIndex = 10;
				for(var i = 0; i < WT.Desk.portals.length; i++) {
					if(WT.Desk.portals[i] != null && i != id) {
						container = document.getElementById("portal-" + i);
						
						container.style.zIndex = zIndex;
						//WT.Desk.portals[i].setZIndex(zIndex);
						zIndex += 10;
					}
				}
				
				container = document.getElementById("portal-" + id);
				container.style.zIndex = zIndex + 10;
				//WT.Desk.portals[id].setZIndex(zIndex);
			},
			
			resize : function(event) {
				var container = document.getElementById("desk-cont");
				var width = document.width - 20;
				var height = document.height - 20;
				
				console.log("Resizing!");
				
				container.style.marginTop = "-" + (height / 2) + "px";
				container.style.marginLeft = "-" + (width / 2) + "px";
				container.style.width = width + "px";
				container.style.height = height + "px";
			}
		};
		return desktop;
	}
};