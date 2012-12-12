/* WebTop Main
 * ------------
 * This class will hold the main data for WebTop as well as the Desktop class that handles
 * pretty much everything that goes on behind the scenes (Icons, Portals, Applications and
 * settings).
 * ------------
 * ToDo's
 * ------------
 * V Fix a framework to handle the Z-Index sorting for WebTop portals and widgets.
 * * Fix a better sorting algorithm for the z-indexing.
 * * Fix handles for all active windows in the WebTop Tool bar.
 * * Fix Min/Max functionality and zIndex event when clicking on a toolbar handle.
 * * Highlight the active handle in the toolbar.
 * V Fix Z-Index for the Tool bar so that it's always above portals and the likes.
 * * Fix the basics for Icons.
 */
var WT = {
	DEFAULT_DESK_ID : "wtdesk",
	CURRENT_PORTAL_ID : 0,
	CURRENT_TOP_Z_INDEX : 1,
	ANIM_DELAY : 200,
	ANIM_SPEED : 50,
	IS_MOBILE : false,
	
	Desktop : function(srcWidth, srcHeight) {
		desktop = {
			width : srcWidth || 640,
			height : srcHeight || 480,
			container : null,
			portals : new Array(),
			
			init : function() {
				// Test the dom createDiv
				var elem = WT.dom.createDiv(
					{"id" : WT.DEFAULT_DESK_ID, 
					"class" : "desktop"}, 
					{"width" : this.width + "px",
					"height" : this.height + "px",
					"marginTop" : Math.floor(-this.height/2) + "px",
					"marginLeft" : Math.floor(-this.width/2) + "px"}
				);
				
				var toolBar = WT.dom.createDiv(
					{"id" : "wt_tool",
					"class" : "wt_tool"}
				);
				
				var toolBarHandles = WT.dom.createDiv(
					{"id" : "wt_tool_handle",
					"class" : "wt_tool_handle"},
					{"maxWidth" : (this.width - 108) + "px"}
				);
				
				var toolBarTime = WT.dom.createDiv(
					{"id" : "wt_tool_time",
					"class" : "wt_tool_time"}
				);
				
				toolBar.appendChild(toolBarHandles);
				toolBar.appendChild(toolBarTime);
				
				elem.appendChild(toolBar);
				this.container = elem;

				document.body.appendChild(elem);
				
				this.setTime();
				this.checkUserAgent();
			},
			
			checkUserAgent : function() {
				var isMobile = navigator.userAgent.search(/Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|Opera Mobi|IEMobile/i);
				//console.log("Is Mobile: " + isMobile);
				if(isMobile > -1) {
					WT.IS_MOBILE = true;
				}
			},
			
			setTime : function() {
				var date, hour, min, sec, year, month, day, timeStr, timeBar, _this;
				_this = this;
				date = new Date();
				hour = date.getHours();
				min = date.getMinutes();
				sec = date.getSeconds();
				year = date.getFullYear();
				month = date.getMonth();
				day = date.getDate();
				
				timeBar = document.getElementById("wt_tool_time");
				
				hour < 10 ? timeStr = "0" + hour + ":" : timeStr = hour + ":";
				min < 10 ? timeStr += "0" + min + ":" : timeStr += min + ":";
				sec < 10 ? timeStr += "0" + sec + "</br>" : timeStr += sec + "</br>";
				timeStr += year + "-";
				month < 10 ? timeStr += "0" + month + "-" : timeStr += month + "-";
				day < 10 ? timeStr += "0" + day : timeStr += day;
				
				timeBar.innerHTML = timeStr;
				setTimeout(function() { _this.setTime(); }, 1000);
			},
		
			addPortal : function(title, width, height) {
				var pos, zIndex;
				zIndex = WT.CURRENT_TOP_Z_INDEX;
				var portal = new WT.portal.Portal(WT.CURRENT_PORTAL_ID, this, title);
				portal.init(this.container);
				portal.setZIndex(zIndex);
				this.portals.push(portal);
				WT.CURRENT_PORTAL_ID++;
				WT.CURRENT_TOP_Z_INDEX++;
				this.updateToolBar();
			},
			
			updateToolBar : function() {
				var _i, appLen;
				var toolBarHandles = document.getElementById("wt_tool_handle");
				
				toolBarHandles.innerHTML = "";
				
				for(portal in this.portals) {
					toolBarHandles.appendChild(this.createHandle(this.portals[portal]));
				}
			},
			
			createHandle : function(portal) {
				var _this = this;
				var id = portal.id;
				var handle = WT.dom.createDiv(
					{"id" : "portal_handle-" + id,
					"class" : "portal_handle"}
				);
				
				handle.innerHTML = this.portals[id].title;
				handle.addEventListener("click", function(){
					_this.triggerHandle(_this, portal);
				}, true);
				
				return handle;
			},
			
			triggerHandle : function(_this, portal) {
				// Check if portal is on top, if so Minimize it.
				// If not, bring portal to the top.
				if(portal.minimized) {
					portal.minimize(portal);
					return 0;
				}
				
				if(portal.active) {
					portal.minimize(portal);
					return 0;
				} else {
					_this.resortPortals(portal);
					return 0;
				}
				// Check if portal is minimized, if so, make it normal.
				
			},
			
			destroyPortal : function(src) {
				var id = src.id;
				var container = this.container;
				var nodes = container.childNodes;
				var contLen = nodes.length;
				var _i = 0;
				
				for(portal in this.portals) {
					if(this.portals[portal].id == src.id) {
						delete this.portals[portal];
						break;
					}
				}
				
				for(_i = 0; _i < contLen; _i++) {
					if(nodes[_i].getAttribute("id") == "portal-" + id) {
						container.removeChild(nodes[_i]);
						break;
					}
				}
				
				this.updateToolBar();
			},
			
			resortPortals : function(topPortal) {
				//console.log("Resorting Portals!");
				//console.log(topPortal);
				topPortal.active = true;
				
				var doSwitch, srcIndex, dstIndex;
				for(portal in this.portals) {
					if(this.portals[portal].id != topPortal.id) {
						this.portals[portal].active = false;
						if(this.portals[portal].zIndex > topPortal.zIndex) {
							srcIndex = topPortal.zIndex;
							dstIndex = this.portals[portal].zIndex;
							topPortal.setZIndex(dstIndex);
							this.portals[portal].setZIndex(srcIndex);
						}
					}
				}
			},
			
			log : function(message) {
				console.log(message);
			}
		};
		return desktop;
	}
};