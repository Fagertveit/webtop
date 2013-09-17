WT.portal = {
	PID: 0,
	/* * * * * * * * * *
	 * Object - Portal *
	 * * * * * * * * * *
	 * Portals are just like windows, just with a fancier name! This is where all the
	 * action will be! :D
	 */
	Portal : function(params) {
		var portal = {
			width: 300,
			height: 200,
			pos: {
				x: 50,
				y: 50
			},
			pid: 0,
			id: "portal-",
			parent: {},
			container: {},
			title: "Portal",
			css: {
				container: "portal-container",
				title: "portal-titlebar",
				titleHandle: "portal-titlebar-handle",
				handle: "portal-resize-handle",
				handleTop: "portal-handle-top",
				handleBottom: "portal-handle-bottom",
				handleLeft: "portal-handle-left",
				handleRight: "portal-handle-right",
				handleBottomLeft: "portal-handle-bottom-left",
				handleBottomRight: "portal-handle-bottom-right",
				btnGroup: "portal-btn-group",
				min: "portal-btn-min",
				max: "portal-btn-max",
				norm: "portal-btn-norm",
				close: "portal-btn-close"
			},
			zpos: 0,
			focused: false,
			maximized: false,
			minimized: false,
			resizable: true,

			constructor : function(params) {
				for(key in params) {
					if(this[key] != undefined) {
						this[key] = params[key];
					}
				}

				this.pid = WT.portal.getPID();
				this.id = this.id + this.pid;

				this.generate();
				this.updateZindex();
				this.addEventListeners();
			},

			generate : function() {
				this.container = $("<div>")
					.addClass("portal")
					.attr("id", this.id)
					.css({
						width: this.width,
						height: this.height,
						left: this.pos.x,
						top: this.pos.y
					});

				if(this.resizable) {
					var handleTop = $("<div>")
						.addClass(this.css['handleTop'])
						.addClass(this.css['handle']);
					var handleBottom = $("<div>")
						.addClass(this.css['handleBottom'])
						.addClass(this.css['handle']);
					var handleLeft = $("<div>")
						.addClass(this.css['handleLeft'])
						.addClass(this.css['handle']);
					var handleRight = $("<div>")
						.addClass(this.css['handleRight'])
						.addClass(this.css['handle']);
					var handleBottomLeft = $("<div>")
						.addClass(this.css['handleBottomLeft'])
						.addClass(this.css['handle']);
					var handleBottomRight = $("<div>")
						.addClass(this.css['handleBottomRight'])
						.addClass(this.css['handle']);

					this.container.append(handleTop);
					this.container.append(handleBottom);
					this.container.append(handleLeft);
					this.container.append(handleRight);
					this.container.append(handleBottomLeft);
					this.container.append(handleBottomRight);
				}
				
				this.generateTitleBar();
				this.generateContainer();
				this.generateFooter();

				this.parent.container.append(this.container);
			},

			generateTitleBar : function() {
				var titlebar = $("<div>")
					.addClass(this.css['title'])
					.html(this.title);

				var titleHandle = $("<div>")
					.addClass(this.css['titleHandle'])

				var btnGroup = $("<div>")
					.addClass(this.css['btnGroup']);

				var min = $("<div>")
					.addClass(this.css['min'])
					.html("_");

				var max = $("<div>")
					.addClass(this.css['max'])
					.html("[]");

				var close = $("<div>")
					.addClass(this.css['close'])
					.html("x");

				btnGroup.append(min);
				btnGroup.append(max);
				btnGroup.append(close);

				titlebar.append(btnGroup);
				titlebar.append(titleHandle);

				this.container.append(titlebar);
			},

			generateContainer : function() {
				var cont = $("<div>")
					.addClass(this.css['container'])
					.attr("id", "portal-container-" + this.pid)

				this.container.append(cont);
			},

			generateFooter : function() {

			},

			setResizable : function(resizable) {
				this.resizable = resizable;
			},

			setZindex : function(zIndex) {
				this.zpos = zIndex;
				this.updateZindex();
			},

			getContainer : function() {
				return this.container.find("." + this.css['container']);
			},

			updateZindex : function() {
				this.container.css("z-index", (this.zpos * 100));
				this.container.find("." + this.css['handle']).css("z-index", (this.zpos * 100) + 10);
			},

			setFocus : function(focused) {
				this.focused = focused;
			},

			focusPortal : function(event, _this) {
				if(!_this.focused) {
					_this.parent.sortPortals(_this.pid);
				}
			},

			move : function(event, _this) {
				var startX = event.clientX;
				var startY = event.clientY;

				var origX = _this.pos['x'];
				var origY = _this.pos['y'];

				var dX = startX - origX;
				var dY = startY - origY;

				$(document).on("mousemove.portal-move-" + _this.pid, function(evt) {
					_this.container.css({
						left: evt.clientX - dX,
						top: evt.clientY - dY
					});
				});

				$(document).on("mouseup.portal-move-" + _this.pid, function(evt) {
					_this.pos['x'] = evt.clientX - dX;
					_this.pos['y'] = evt.clientY - dY;
					$(document).off(".portal-move-" + _this.pid);
				});
			},

			resize : function(event, _this) {
				if(!_this.resizable) {
					return 0;
				}

				var startX = event.clientX;
				var startY = event.clientY;

				var origX = _this.pos['x'];
				var origY = _this.pos['y'];

				var origW = _this.width;
				var origH = _this.height;

				var dX = startX - origX;
				var dY = startY - origY;

				var dW = startX - origW;
				var dH = startY - origH;

				if($(event.currentTarget).hasClass(_this.css['handleTop'])) {
					$(document).on("mousemove.portal-resize-" + _this.pid, function(evt) {
						_this.container.css({
							top: evt.clientY - dY,
							height: origH - (evt.clientY - dY - origY),
						});
					});

					$(document).on("mouseup.portal-resize-" + _this.pid, function(evt) {
						_this.pos['y'] = evt.clientY - dY;
						_this.height = origH - (evt.clientY - dY - origY);
						$(document).off(".portal-resize-" + _this.pid);
					});
				} else if($(event.currentTarget).hasClass(_this.css['handleBottom'])) {
					$(document).on("mousemove.portal-resize-" + _this.pid, function(evt) {
						_this.container.css({
							height: evt.clientY - dH,
						});
					});

					$(document).on("mouseup.portal-resize-" + _this.pid, function(evt) {
						_this.height = evt.clientY - dH;
						$(document).off(".portal-resize-" + _this.pid);
					});
				} else if($(event.currentTarget).hasClass(_this.css['handleLeft'])) {
					$(document).on("mousemove.portal-resize-" + _this.pid, function(evt) {
						_this.container.css({
							left: evt.clientX - dX,
							width: origW - (evt.clientX - dX - origX),
						});
					});

					$(document).on("mouseup.portal-resize-" + _this.pid, function(evt) {
						_this.width = origW - (evt.clientX - dX - origX);
						_this.pos['x'] = evt.clientX - dX;
						$(document).off(".portal-resize-" + _this.pid);
					});
				} else if($(event.currentTarget).hasClass(_this.css['handleRight'])) {
					$(document).on("mousemove.portal-resize-" + _this.pid, function(evt) {
						_this.container.css({
							width: evt.clientX - dW,
						});
					});

					$(document).on("mouseup.portal-resize-" + _this.pid, function(evt) {
						_this.width = evt.clientX - dW;
						$(document).off(".portal-resize-" + _this.pid);
					});
				} else if($(event.currentTarget).hasClass(_this.css['handleBottomLeft'])) {
					$(document).on("mousemove.portal-resize-" + _this.pid, function(evt) {
						_this.container.css({
							left: evt.clientX - dX,
							width: origW - (evt.clientX - dX - origX),
							height: evt.clientY - dH
						});
					});

					$(document).on("mouseup.portal-resize-" + _this.pid, function(evt) {
						_this.pos['x'] = evt.clientX - dX,
						_this.height = evt.clientY - dH;
						_this.width = origW - (evt.clientX - dX - origX),
						$(document).off(".portal-resize-" + _this.pid);
					});
				} else if($(event.currentTarget).hasClass(_this.css['handleBottomRight'])) {
					$(document).on("mousemove.portal-resize-" + _this.pid, function(evt) {
						_this.container.css({
							width: evt.clientX - dW,
							height: evt.clientY - dH
						});
					});

					$(document).on("mouseup.portal-resize-" + _this.pid, function(evt) {
						_this.height = evt.clientY - dH;
						_this.width = evt.clientX - dW;
						$(document).off(".portal-resize-" + _this.pid);
					});
				} else {
					// Got nuthin' to do! Let's get outa here!
				}
			},

			minimize : function(event, _this) {
				event.preventDefault();
				event.stopPropagation();

				_this.container.css({
					left: _this.parent.width / 2,
					top: _this.parent.height,
					width: 1,
					height: 1
				});

				_this.focused = false;
				_this.maximized = false;
				_this.minimized = true;
			},

			maximize : function(event, _this) {
				event.preventDefault();
				event.stopPropagation();

				_this.container.css({
					left: -1,
					top: -1,
					width: _this.parent.width,
					height: _this.parent.height - 32
				});

				_this.container.find("." + _this.css['max'])
					.removeClass(_this.css['max'])
					.addClass(_this.css['norm']);

				_this.focused = true;
				_this.minimized = false;
				_this.maximized = true;
			},

			normalize : function(event, _this) {
				event.preventDefault();
				event.stopPropagation();

				_this.container.css({
					left: _this.pos['x'],
					top: _this.pos['y'],
					width: _this.width,
					height: _this.height
				});

				_this.container.find("." + _this.css['norm'])
					.removeClass(_this.css['norm'])
					.addClass(_this.css['max']);

				_this.minimized = false;
				_this.maximized = false;
			},

			close : function(event, _this) {
				_this.parent.removePortal(_this.pid);
			},

			addEventListeners : function() {
				var _this = this;
				$(this.container)
					.on("click.portal-" + this.pid, function(e){_this.focusPortal(e, _this);})
					.on("mousedown.portal-" + this.pid, "." + this.css['titleHandle'], function(e){_this.move(e, _this);})
					.on("mousedown.portal-" + this.pid, "." + this.css['handle'], function(e){_this.resize(e, _this);})
					.on("click.portal-" + this.pid, "." + this.css['min'], function(e){_this.minimize(e, _this);})
					.on("click.portal-" + this.pid, "." + this.css['max'], function(e){_this.maximize(e, _this);})
					.on("click.portal-" + this.pid, "." + this.css['norm'], function(e){_this.normalize(e, _this);})
					.on("click.portal-" + this.pid, "." + this.css['close'], function(e){_this.close(e, _this);})
					.on("wt:normalize.portal-" + this.pid, function(e){_this.normalize(e, _this);})
					.on("wt:minimize.portal-" + this.pid, function(e){_this.minimize(e, _this);})
					.on("wt:maximize.portal-" + this.pid, function(e){_this.maximize(e, _this);})
					.on("wt:close.portal-" + this.pid, function(e){_this.close(e, _this);});
			},

			deconstructor : function() {
				$(this.container)
					.off(".portal-" + this.pid)
					.remove();
			}
		};
		portal.constructor(params);

		return portal;
	},

	getPID : function() {
		var pid = WT.PID;

		WT.PID += 1;

		return pid;
	}
};

WTPortal = WT.portal.Portal;