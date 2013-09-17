/*
 * WebTop Main Class
 */

var WT = {
	UID: 0,
	PID: 0,
	AID: 0,
	/* * * * * * * * * * *
	 * Object - Desktop  *
	 * * * * * * * * * * *
	 * The desktop object is the core object in the webtop environment, it keeps track on all the portal
	 * objects, and background functions such as time and core events.
	 * 
	 */
	Desktop : function(params) {
		var desktop = {
			width: 640,
			height: 480,
			parent: "",
			container: {},
			id: "desk-",
			uid: 0,
			quickbar: {},
			portals: {},
			applications: {},
			zorder: [],
			settings: {},
			settingsFile: "default.json",

			constructor : function(params) {
				/* Fetch parameters and update settings */
				for(key in params) {
					if(this[key] != undefined) {
						this[key] = params[key];
					}
				}
				this.uid = WT.getUID();
				this.id = "desk-" + this.uid;
				this.loadStartMenu();
			},

			loadStartMenu : function() {
				var _this = this;
				$.ajax({
					url: this.settingsFile,
					type: "GET",
					dataType: "json"
				}).done(function(data) {
					_this.settings = data;
					_this.generate();
					_this.quickbar = new WT.Quickbar({width: _this.width, parent: _this});
				});
			},

			generate : function() {
				this.container = $("<div>")
					.addClass("desktop")
					.attr("id", this.id)
					.css({
						width: this.width,
						height: this.height
					});

				this.parent.append(this.container);
			},

			generateZorderList : function() {

			},

			sortPortals : function(first) {
				var i = 0;
				var len = this.zorder.length;

				for(i; i < len; i += 1) {
					if(this.zorder[i] == first) {
						this.zorder.splice(i, 1);
						continue;
					}
				}

				this.zorder.push(first);

				i = 0;
				len = this.zorder.length;

				for(i; i < len; i += 1) {
					this.portals[this.zorder[i]].setFocus(false);
					this.portals[this.zorder[i]].setZindex(i);
				}

				var lastPortal = this.portals[this.zorder[this.zorder.length - 1]];

				if(!lastPortal.minimized) {
					this.portals[this.zorder[this.zorder.length - 1]].setFocus(true);
				}
			},

			addPortal : function(params) {
				params.parent = this;
				var portal = new WTPortal(params);
				this.portals[WT.PID - 1] = portal;
				this.zorder.push(WT.PID - 1);
				this.portals[WT.PID - 1].setZindex(this.zorder.length);
				this.quickbar.updatePortalHandles();
				return this.portals[WT.PID - 1];
			},

			removePortal : function(pid) {
				var i = 0;
				var len = this.zorder.length;

				this.portals[pid].deconstructor();
				delete this.portals[pid];
				for(i; i < len; i += 1) {
					if(this.zorder[i] == pid) {
						this.zorder.splice(i, 1);
						continue;
					}
				}
				this.quickbar.updatePortalHandles();
			},

			addApplication : function(app, params) {
				params.parent = this;
				console.log("Application: " + app);
				var application = WT.APP[app].Application(params);
				application.setId(WT.getAID());
				this.applications[application.id] = application;
				return application;
			},
		};

		desktop.constructor(params);

		return desktop;
	},

	/* * * * * * * * * * *
	 * Object - Quickbar *
	 * * * * * * * * * * *
	 * The quickbar is the link to webtops applications, this also keeps minimized applications
	 * and quick utility widgets.
	 *
	 */
	Quickbar : function(params) {
		var quickbar = {
			width: 640,
			height: 32,
			parent: {},
			id: "quickbar-",
			container: {},
			align: "bottom",
			startMenu: {},
			css: {
				start: "quickbar-start",
				time: "quickbar-time",
				handleCont: "quickbar-portal-container",
				portalHandle: "quickbar-portal-handle"
			},

			constructor : function(params) {
				for(key in params) {
					if(this[key] != undefined) {
						this[key] = params[key];
					}
				}

				this.id = this.id + this.parent.uid;
				this.generate();
				this.startTime();
				this.addEventListeners();

				console.log(this.parent.settings);
				this.startMenu = new WT.Start({
					parent: this, 
					sections: this.parent.settings.sections, 
					applications: this.parent.settings.applications
				});
			},

			generate : function() {
				this.container = $("<div>")
					.addClass("quickbar")
					.attr("id", this.id)
					.css(this.align, 0);

				var timeCont = $("<div>")
					.addClass(this.css['time'])
					.attr("id", this.id + "-time")
					.html("19:20<br>28-07-2013");

				var handleCont = $("<div>")
					.addClass(this.css['handleCont'])

				this.container.append(handleCont);
				this.container.append(timeCont);

				$("#" + this.parent.id).append(this.container);
			},

			startTime : function() {
				var _this = this;
				window.setInterval(function(){
					_this.updateTime();
				}, 1000);
			},

			updateTime : function() {
				var date, hour, min, sec, year, month, day, timeStr, timeBar, _this;

				date = new Date();
				hour = date.getHours();
				min = date.getMinutes();
				sec = date.getSeconds();
				year = date.getFullYear();
				month = date.getMonth();
				month += 1;
				day = date.getDate();
				
				timeBar = document.getElementById("wt_tool_time");
				
				hour < 10 ? timeStr = "0" + hour + ":" : timeStr = hour + ":";
				min < 10 ? timeStr += "0" + min + ":" : timeStr += min + ":";
				sec < 10 ? timeStr += "0" + sec + "</br>" : timeStr += sec + "</br>";
				timeStr += year + "-";
				month < 10 ? timeStr += "0" + month + "-" : timeStr += month + "-";
				day < 10 ? timeStr += "0" + day : timeStr += day;

				$("#" + this.id + "-time").html(timeStr);
			},

			updatePortalHandles : function() {
				var _this = this;
				var cont = this.container.find("." + this.css['handleCont']);
				cont.html("");

				$.each(this.parent.portals, function(i, value) {
					var handle = $("<div>")
						.addClass(_this.css['portalHandle'])
						.attr("data-pid", value.pid)
						.html(value.title);

					cont.append(handle);
				});
			},

			setFocus : function(event, _this) {
				var pid = $(event.currentTarget).attr("data-pid");
				var portal = _this.parent.portals[pid];

				if(portal.focused && !portal.minimized) {
					portal.setFocus(false);
					portal.container.trigger("wt:minimize");
				} else if(portal.minimized) {
					portal.container.trigger("wt:normalize");
					_this.parent.sortPortals(pid);
				} else if(!portal.focused) {
					_this.parent.sortPortals(pid);
				}

				//console.log("Portal State: Min - " + portal.minimized + " Max - " + portal.maximized + " Focused - " + portal.focused);
			},

			addEventListeners : function() {
				var _this = this;

				this.container
					.on("click", "." + this.css['portalHandle'], function(e){_this.setFocus(e, _this);});
			}
		};

		quickbar.constructor(params);

		return quickbar;
	},

	Start : function(params) {
		var start = {
			parent: {},
			container: {},
			menuContainer: {},
			menu: {},
			menues: {},
			items: {},
			sections: {},
			applications: {},
			css: {
				start: "quickbar-start",
				menuContainer: "quickbar-start-container"
			},

			constructor : function(params) {
				for(key in params) {
					if(this[key] != undefined) {
						this[key] = params[key];
					}
				}

				this.generate();
				this.loadMenu();
				this.loadMenuItems();
				this.addEventListeners();
			},

			generate : function() {
				this.container = $("<div>")
					.addClass(this.css['start'])
					.html("START");

				this.menuContainer = $("<div>")
					.addClass(this.css['menuContainer'])
					.css("display", "none");

				this.container.append(this.menuContainer);

				this.parent.container.append(this.container);
			},

			loadMenu : function() {
				for(key in this.sections) {
					this.menues[key] = new WT.StartMenu({
						parent: this,
						data: this.sections[key]
					});
				}
			},

			loadMenuItems : function() {
				for(key in this.applications) {
					this.items[key] = new WT.StartMenuItem({
						parent: this.menues[this.applications[key].section],
						data: this.applications[key]
					});
				}
			},

			addMenu : function() {

			},

			addMenuItem : function() {

			},

			toggleStartMenu : function(e, _this) {
				console.log("Clicking the start buttom!");
				_this.container.children("." + _this.css['menuContainer']).toggle();
			},

			addEventListeners : function() {
				var _this = this;

				this.container
					.on("click", function(e){_this.toggleStartMenu(e, _this);});
			}
		};
		start.constructor(params);

		return start;
	},

	StartMenu : function(params) {
		var startmenu = {
			parent: {},
			container: {},
			data: {},

			constructor : function(params) {
				for(key in params) {
					if(this[key] != undefined) {
						this[key] = params[key];
					}
				}

				this.generate();
			},

			generate : function() {
				this.container = $("<div>")
					.addClass("quickbar-start-menu")
					.text(this.data.title);

				icon = $("<img>")
					.addClass("quickbar-icon")
					.attr("src", this.data.icon);

				this.container.append(icon);
				this.parent.menuContainer.append(this.container);
			},

			addEventListeners : function() {
				
			}
		};
		startmenu.constructor(params);

		return startmenu;
	},

	StartMenuItem : function(params) {
		var startmenuitem = {
			constructor : function(params) {
				for(key in params) {
					if(this[key] != undefined) {
						this[key] = params[key];
					}
				}
			}
		};
		startmenuitem.constructor(params);

		return startmenuitem;
	},
	/* * * * * * * * * *
	 * Method - getUID *
	 * * * * * * * * * *
	 * Generates a new UID for the desktop environment, in theory this means that we can have
	 * multiple desktops at the same page!
	 *
	 */
	getUID : function() {
		var uid = WT.UID;
		WT.UID += 1;
		return uid;
	},

	getAID : function() {
		var aid = WT.AID;
		WT.AID += 1;
		return aid;
	}
};

WTDesktop = WT.Desktop;