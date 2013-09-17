/* * * * * * * * * * *
 * Core - Container  *
 * * * * * * * * * * *
 * This class handles different kinds of containers that you can append to portals.
 * These are made to make layout and structure a wee bit more easy to handle, the
 * user gets total control of it's size, position and rules such as margin and padding.
 * There are 2 types of containers, Pane and TabbedPane.
 */

WT.container = {

	Pane : function(params) {
		var pane = {
			container : {},
			parent : {},
			width: 0,
			height: 0,
			vscroll: "hidden",
			hscroll: "hidden",
			title: "",
			pos: {
				x: 0,
				y: 0
			},
			margin: 0,
			padding: 0,
			border: "none",
			position: "relative",
			onclick: {},
			onmouseover: {},
			onmouseout: {},
			onmousedown: {},
			css: {
				container: "wt-pane",
				custom: ""
			},

			constructor : function(params) {
				for(key in params) {
					if(this[key] != undefined) {
						this[key] = params[key];
					}
				}
				this.render();
			},

			render : function() {
				this.container = $("<div>")
					.addClass(this.css["container"])
					.css({
						width: this.width,
						height: this.height,
						left: this.pos.x,
						top: this.pos.y,
						margin: this.margin,
						padding: this.padding,
						border: this.border,
						position: this.position,
						overflowX: this.hscroll,
						overflowY: this.vscroll
					});

				if(this.css["custom"] != "") {
					this.container.addClass(this.css['custom']);
				}

				this.parent.append(this.container);
			},

			append : function(elem) {
				this.container.append(elem);
			},

			prepend : function(elem) {
				this.container.prepend(elem);
			},

			hide : function() {

			},

			show : function() {

			},

			click_handler : function(e, _this) {

			},

			mouseover_handler : function(e, _this) {

			},

			mouseout_handler : function(e, _this) {

			},

			mousedown_handler : function(e, _this) {

			},

			deconstruct : function() {

			},

			addEventListeners : function() {
				var _this = this;
				this.container
					.on("click", function(e){_this.click_handler(e, _this);})
					.on("mouseover", function(e){_this.mouseover_handler(e, _this);})
					.on("mouseout", function(e){_this.mouseout_handler(e, _this);})
					.on("mousedown", function(e){_this.mousedown_handler(e, _this);});
			}
		};
		pane.constructor(params);

		return pane;
	},

	TabbedPane : function() {
		var tabbedpane = {
			constructor : function(params) {

			}
		};
		tabbedpane.constructor(params);

		return tabbedpane;
	}
};

WTPane = WT.container.Pane;