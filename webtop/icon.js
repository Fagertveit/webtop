/* WebTop - Icon
 * -------------
 * A class for keeping track of WebTop icons and giving them the evenlisteners needed to start
 * the application that the icon is connected to!
 * 
 * icons will get a z-index of 2.
 */
WT.icon = {
	Icon : function(img, pos, app, srcTitle, srcParent, srcId) {
		var icon = {
			image : img || "img/wt-icon-default.png",
			position : pos || [0, 0],
			application : app || null,
			title : srcTitle || "Untitled",
			parent : srcParent || "desk-cont",
			id : srcId || 0,
			
			init : function() {
				var container = document.createElement("div");
				var image = document.createElement("div");
				var title = document.createElement("div");
				var parent = document.getElementById(this.parent);
				
				container.setAttribute("class", "icon");
				//container.setAttribute("app", this.application);
				container.setAttribute("iconid", this.id);
				container.addEventListener("click", this.onClick, true);
				container.style.left = 16 + this.position[0] * 38 + "px";
				container.style.top = 16 + this.position[1] * 48 + "px";
				container.style.zIndex = 2;
				
				image.setAttribute("class", "image");
				image.setAttribute("iconid", this.id);
				image.style.backgroundImage = "url(" + this.image + ")";
				
				title.setAttribute("class", "title");
				title.setAttribute("iconid", this.id);
				title.innerHTML = this.title;
				
				container.appendChild(image);
				container.appendChild(title);
				
				parent.appendChild(container);
			},
		
			onClick : function(e) {
				var target = e.target;
				var id = target.getAttribute("iconid");
				var app = WT.Desk.icons[target.getAttribute("iconid")].application;
				//var d = new Date();
				//var clickTimer = d.getTime();
				
				WT.Desk.addApplication(app);
				
				e.stopPropagation();
				e.preventDefault();
				/*
				function clickHandler(e) {
					var secondTimer = d.getTime();
					
					if(secondTimer - clickTimer < 500) {
						
					}
					
					e.stopPropagation();
					e.preventDefault();
					
					document.removeEventListener("click", clickHandler, this);
				}*/
			}
		};
		return icon;
	}
};