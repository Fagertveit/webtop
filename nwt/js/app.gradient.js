/* * * * * * * * * * * * * * * * *
 * Application - Gradient Editor *
 * * * * * * * * * * * * * * * * *
 * A Test application for the Webtop system, this is mostly made to develop
 * common ui elements and core functions such as menues, buttons, radio buttons and
 * checkboxes! Somewhat based on the Gradient tool I wrote for the first WebTop
 * environment.
 *
 */
WT.APP.gradient = {
	TITLE: "Color Picker",
	DESCRIPTION: "A Gradient editor, generates CSS gradients.",
	WIDTH: 510,
	HEIGHT: 310,

	Application : function(params) {
		return new WT.APP.gradient.GradientEdit(params);
	},

	GradientEdit : function(params) {
		var gradient = {
			portal : {},
			parent : {},
			container : {},
			id : 0,
			colorPicker : {},

			constructor : function(params) {
				this.parent = params.parent;
				this.portal = this.parent.addPortal({
					title : WT.APP.gradient.TITLE, 
					width: WT.APP.gradient.WIDTH, 
					height: WT.APP.gradient.HEIGHT,
					resizable: false
				});
				this.container = this.portal.getContainer();
				this.container.css({backgroundColor: "rgb(230, 230, 230)"})
				this.generate();

				this.addEventListeners();
			},

			generate : function() {
				var _this = this;
				this.colorPicker = new WTColorPicker({parent: this.container});
			},

			setId : function(id) {
				this.id = id;
			},

			executeColor : function(e, params) {
				console.log(e);
				console.log(params);
			},

			addEventListeners : function() {
				var _this = this;
				this.colorPicker.container.container.on("wt:execute", function(e, params){_this.executeColor(e, params);});
			},

			deconstructor : function() {

			}
		};
		gradient.constructor(params);

		return gradient;
	}
};