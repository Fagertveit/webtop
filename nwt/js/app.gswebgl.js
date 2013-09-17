/* * * * * * * * * * * * * * * * * * *
 * Application - GameSaw WebGL Test  *
 * * * * * * * * * * * * * * * * * * *
 * Testing the implementetion of GameSaw WEBGL Panes and combining them
 * with general WebTop UI components, this will be the base of many interesting
 * applications using WebGL as a base.
 *
 */
WT.APP.gswebgl = {
	TITLE: "GameSaw - WebGL Test Suite",
	DESCRIPTION: "A test suite to show GameSaw's OpenGL features.",
	WIDTH: 320,
	HEIGHT: 240,

	Application : function(params) {
		return new WT.APP.gswebgl.GSWebGLTest(params);
	},

	GSWebGLTest : function(params) {
		var gswebgl = {
			portal : {},
			parent : {},
			container : {},
			id : 0,
			colorPicker : {},

			constructor : function(params) {
				this.parent = params.parent;
				this.portal = this.parent.addPortal({
					title : WT.APP.gswebgl.TITLE, 
					width: WT.APP.gswebgl.WIDTH, 
					height: WT.APP.gswebgl.HEIGHT,
					resizable: false
				});
				this.container = this.portal.getContainer();
				this.generate();

				this.addEventListeners();
			},

			generate : function() {
				var _this = this;
			},

			setId : function(id) {
				this.id = id;
			},

			addEventListeners : function() {
				var _this = this;
			},

			deconstructor : function() {

			}
		};
		gswebgl.constructor(params);

		return gswebgl;
	}
};