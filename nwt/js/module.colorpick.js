/* * * * * * * * * * * * *
 * Module - ColorPicker  *
 * * * * * * * * * * * * *
 * A Photoshop like color selection tool
 * the user should be able to choose color
 * from a RBG like palette, in future development
 * I might make it work with different color modes
 * such as HSLA and CMYK.
 */
 
WT.MODULE.colorpick = {
	ColorPicker : function(params) {
		var colorpicker = {
			parent: {},
			container: {},
			css: {
				SLHue: "wt-colorpicker-sl-hue",
				SLLight: "wt-colorpicker-sl-light",
				SLDark: "wt-colorpicker-sl-dark",
				hue: "wt-colorpicker-huebar",
			},
			oldColor: new WTColor({r: 255, g: 0, b: 0}),
			newColor: new WTColor({r: 255, g: 0, b: 0}),
			images: {
				blackGradient: new WTImage({width: 256, height: 256}),
				whiteHorizontalGradient: new WTImage({width: 256, height: 256}),
				whiteVerticalGradient: new WTImage({width: 256, height: 256}),
				hueBar: new WTImage({width: 20, height: 256}),
				hueGradient: new WTImage({width: 256, height: 256}),
				whiteBar: new WTImage({width: 20, height: 256}),
				blackBar: new WTImage({width: 20, height: 256}),
			},
			labels: {
				xyBack: {},
				xyMiddle: {},
				xyFront: {},
				zBack: {},
				zMiddle: {},
				zFront: {},
				newColor: {},
				oldColor: {},
				h: {},
				s: {},
				l: {},
				r: {},
				g: {},
				b: {},
				hex: {}
			},
			slides: {
				zSlide: {},
				xySlide: {},
				panes: {
					xy: {},
					z: {}
				},
				indicators: {
					xy: {},
					z: {
						pane: {},
						right: {},
						left: {}
					}
				}
			},
			inputs: {
				h: {},
				s: {},
				l: {},
				r: {},
				g: {},
				b: {},
				hex: {}
			},
			radios: {
				group: {},
				h: {},
				s: {},
				l: {},
				r: {},
				g: {},
				b: {},
			},
			buttons: {
				ok: {},
				cancel: {}
			},
			panes: {
				slide: {},
				color: {},
				button: {},
				input: {},
				h: {},
				s: {},
				l: {},
				r: {},
				g: {},
				b: {},
				hex: {}
			},

			constructor : function(params) {
				for(key in params) {
					if(this[key] != undefined) {
						this[key] = params[key];
					}
				}

				this.newColor.RGBtoHSL();
				this.oldColor.RGBtoHSL();

				this.images['hueBar'].generate();
				this.images['hueBar'].setData(WT.MODULE.colorpick.generateHueBar(this.images['hueBar']));
				this.images['blackBar'].generate();
				this.images['blackBar'].setData(WT.MODULE.colorpick.generateBlackGradient(this.images['blackBar']));
				this.images['whiteBar'].generate();
				this.images['whiteBar'].setData(WT.MODULE.colorpick.generateWhiteVerticalGradient(this.images['whiteBar']));
				this.images['hueGradient'].generate();
				this.images['hueGradient'].setData(WT.MODULE.colorpick.generateHueGradient(this.images['hueGradient']));
				this.images['blackGradient'].generate();
				this.images['blackGradient'].setData(WT.MODULE.colorpick.generateBlackGradient(this.images['blackGradient']));
				this.images['whiteHorizontalGradient'].generate();
				this.images['whiteHorizontalGradient'].setData(WT.MODULE.colorpick.generateWhiteHorizontalGradient(this.images['whiteHorizontalGradient']));
				this.images['whiteVerticalGradient'].generate();
				this.images['whiteVerticalGradient'].setData(WT.MODULE.colorpick.generateWhiteVerticalGradient(this.images['whiteVerticalGradient']));
				this.buildPanes();

				this.setInputFromColor();
				this.addEventListeners();
			},

			buildPanes : function() {
				var _this = this;
				this.container = new WTPane({parent: this.parent, width: 496, height: 272});
				this.container.container.css({border: "1px solid rgba(0, 0, 0, 0)", margin: "5px"});

				this.panes['slide'] = new WTPane({parent: this.container.container, width: 310, height: 270});
				this.panes['color'] = new WTPane({parent: this.container.container, width: 80, height: 70});
				this.panes['button'] = new WTPane({parent: this.container.container, width: 100, height: 70});
				this.panes['input'] = new WTPane({parent: this.container.container, width: 182, height: 185});

				this.labels['xyBack'] = new WTLabel({parent: this.panes['slide'].container, text: ""});
				this.labels['xyBack'].container.css({
					position: "absolute",
					left: 5,
					top: 5,
					width: 256,
					height: 256,
					backgroundColor: "rgb(255, 0, 0)",
					border: "1px solid rgba(0, 0, 0, 1)"
				});

				this.labels['xyMiddle'] = new WTLabel({parent: this.panes['slide'].container, text: ""});
				this.labels['xyMiddle'].container.css({
					position: "absolute",
					left: 6,
					top: 6,
					width: 256,
					height: 256,
					background: 'url(' + this.images['whiteHorizontalGradient'].src + ')'
				});

				this.labels['xyFront'] = new WTLabel({parent: this.panes['slide'].container, text: ""});
				this.labels['xyFront'].container.css({
					position: "absolute",
					left: 6,
					top: 6,
					width: 256,
					height: 256,
					background: 'url(' + this.images['blackGradient'].src + ')'
				});

				this.labels['zBack'] = new WTLabel({parent: this.panes['slide'].container, text: ""});
				this.labels['zBack'].container.css({
					position: "absolute",
					left: 274,
					top: 5,
					width: 20,
					height: 256,
					border: "1px solid rgba(0, 0, 0, 1)",
					background: 'url(' + this.images['hueBar'].src + ')'
				});

				this.labels['zMiddle'] = new WTLabel({parent: this.panes['slide'].container, text: ""});
				this.labels['zMiddle'].container.css({
					position: "absolute",
					left: 275,
					top: 6,
					width: 20,
					height: 256,
					background: 'url(' + this.images['hueBar'].src + ')'
				});

				this.labels['zFront'] = new WTLabel({parent: this.panes['slide'].container, text: ""});
				this.labels['zFront'].container.css({
					position: "absolute",
					left: 275,
					top: 6,
					width: 20,
					height: 256,
					background: 'url(' + this.images['hueBar'].src + ')'
				});

				this.slides['panes']['xy'] = new WTPane({parent: this.panes['slide'].container, width: 256, height: 256, pos: {x: 6, y: 6}, position: "absolute", vscroll: "hidden", hscroll: "hidden"});
				this.slides['panes']['z'] = new WTPane({parent: this.panes['slide'].container, width: 40, height: 256, pos: {x: 265, y: 6}, position: "absolute", vscroll: "visible", hscroll: "visible"});

				this.slides['indicators']['xy'] = new WTLabel({parent: this.slides['panes']['xy'].container, width: 20, height: 20, text: ""});
				this.slides['indicators']['xy'].container.css({
					position: "absolute",
					left: 100,
					top: 100,
					width: 20,
					height: 20,
					cursor: "default",
					background: 'url(img//gradient-color-indicator.png)'
				});

				this.slides['indicators']['z']['pane'] = new WTPane({parent: this.slides['panes']['z'].container, width: 40, height: 10});
				this.slides['indicators']['z']['pane'].container.css({
					position: "absolute",
					left: 265,
					top: 100,
					cursor: "default"
				});

				this.slides['indicators']['z']['left'] = new WTLabel({parent: this.slides['indicators']['z']['pane'].container, text: ""});
				this.slides['indicators']['z']['left'].container.css({
					position: "absolute",
					left: 0,
					top: 0,
					width: 10,
					height: 9,
					background: "url(img/hue-arrow-left.png)"
				});

				this.slides['indicators']['z']['right'] = new WTLabel({parent: this.slides['indicators']['z']['pane'].container, text: ""});
				this.slides['indicators']['z']['right'].container.css({
					position: "absolute",
					right: 0,
					top: 0,
					width: 10,
					height: 9,
					background: "url(img/hue-arrow-right.png)"
				});

				this.slides.xySlide = new WTSlider2D({container: this.slides['panes']['xy'].container, handle: this.slides['indicators']['xy'].container, handleMargin: {x: -10, y: -10}});
				this.slides.zSlide = new WTSlider({container: this.slides['panes']['z'].container, handle: this.slides['indicators']['z']['pane'].container, handleMargin: {x: 0, y: -4}, direction: "vertical"});

				this.labels['newColor'] = new WTLabel({parent: this.panes['color'].container, text: ""});
				this.labels['newColor'].container.css({
					position: "absolute",
					left: 5,
					top: 5,
					width: 60,
					height: 30,
					borderLeft: "1px solid rgb(0, 0, 0)",
					borderTop: "1px solid rgb(0, 0, 0)",
					borderRight: "1px solid rgb(0, 0, 0)",
					backgroundColor: "rgb(" + this.newColor.r + ", " + this.newColor.g + ", " + this.newColor.b + ")"
				});

				this.labels['oldColor'] = new WTLabel({parent: this.panes['color'].container, text: ""});
				this.labels['oldColor'].container.css({
					position: "absolute",
					left: 5,
					top: 35,
					width: 60,
					height: 30,
					borderLeft: "1px solid rgb(0, 0, 0)",
					borderRight: "1px solid rgb(0, 0, 0)",
					borderBottom: "1px solid rgb(0, 0, 0)",
					backgroundColor: "rgb(" + this.oldColor.r + ", " + this.oldColor.g + ", " + this.oldColor.b + ")"
				});

				this.buttons.ok = new WTButton({parent: this.panes['button'].container, title: "Ok"});
				this.panes['button'].container.css({fontSize: "6px"})
				this.panes['button'].container.append("<br>");
				this.buttons.cancel = new WTButton({parent: this.panes['button'].container, title: "Cancel"});

				this.panes['input'].container.css({marginTop: "8px"});

				this.panes['h'] = new WTPane({parent: this.panes['input'].container, width: 180, height: 24});
				this.panes['s'] = new WTPane({parent: this.panes['input'].container, width: 180, height: 24});
				this.panes['l'] = new WTPane({parent: this.panes['input'].container, width: 180, height: 32});
				this.panes['r'] = new WTPane({parent: this.panes['input'].container, width: 180, height: 24});
				this.panes['g'] = new WTPane({parent: this.panes['input'].container, width: 180, height: 24});
				this.panes['b'] = new WTPane({parent: this.panes['input'].container, width: 180, height: 32});
				this.panes['hex'] = new WTPane({parent: this.panes['input'].container, width: 180, height: 24});

				this.radios['group'] = new WTRadioGroup({onchange: _this.switch_state, owner: _this});

				this.radios['h'] = new WTRadioButton({parent: this.panes['h'].container});
				this.labels['h'] = new WTLabel({parent: this.panes['h'].container, text: "H:"});
				this.inputs['h'] = new WTInput({parent: this.panes['h'].container, width: 22});
				this.radios['group'].addOption(this.radios['h']);
				this.panes['h'].container.css("line-height", "18px");
				this.labels['h'].container.css({width: 20, lineHeight: "20px"});
				this.panes['h'].append(' °');

				this.radios['s'] = new WTRadioButton({parent: this.panes['s'].container});
				this.labels['s'] = new WTLabel({parent: this.panes['s'].container, text: "S:"});
				this.inputs['s'] = new WTInput({parent: this.panes['s'].container, width: 22});
				this.radios['group'].addOption(this.radios['s']);
				this.panes['s'].container.css("line-height", "18px");
				this.labels['s'].container.css({width: 20, lineHeight: "20px"});
				this.panes['s'].append(' %');

				this.radios['l'] = new WTRadioButton({parent: this.panes['l'].container});
				this.labels['l'] = new WTLabel({parent: this.panes['l'].container, text: "L:"});
				this.inputs['l'] = new WTInput({parent: this.panes['l'].container, width: 22});
				this.radios['group'].addOption(this.radios['l']);
				this.panes['l'].container.css("line-height", "18px");
				this.labels['l'].container.css({width: 20, lineHeight: "20px"});
				this.panes['l'].append(' %');

				//this.radios['r'] = new WTRadioButton({parent: this.panes['r'].container});
				this.labels['r'] = new WTLabel({parent: this.panes['r'].container, text: "R:"});
				this.inputs['r'] = new WTInput({parent: this.panes['r'].container, width: 22});
				//this.radios['group'].addOption(this.radios['r']);
				this.panes['r'].container.css("line-height", "18px");
				this.labels['r'].container.css({marginLeft: 22, width: 20, lineHeight: "20px"});

				//this.radios['g'] = new WTRadioButton({parent: this.panes['g'].container});
				this.labels['g'] = new WTLabel({parent: this.panes['g'].container, text: "G:"});
				this.inputs['g'] = new WTInput({parent: this.panes['g'].container, width: 22});
				//this.radios['group'].addOption(this.radios['g']);
				this.panes['g'].container.css("line-height", "18px");
				this.labels['g'].container.css({marginLeft: 22, width: 20, lineHeight: "20px"});

				//this.radios['b'] = new WTRadioButton({parent: this.panes['b'].container});
				this.labels['b'] = new WTLabel({parent: this.panes['b'].container, text: "B:"});
				this.inputs['b'] = new WTInput({parent: this.panes['b'].container, width: 22});
				//this.radios['group'].addOption(this.radios['b']);
				this.panes['b'].container.css("line-height", "18px");
				this.labels['b'].container.css({marginLeft: 22, width: 20, lineHeight: "20px"});

				this.labels['hex'] = new WTLabel({parent: this.panes['hex'].container, text: "#"});
				this.inputs['hex'] = new WTInput({parent: this.panes['hex'].container, width: 52});
				this.panes['hex'].container.css("line-heigth", "18px");
				this.inputs['hex'].container.css({
					height: 14,
					marginLeft: 5
				});

				this.radios['group'].change_handler(0);
			},

			switch_state : function(_this) {
				var color = new WTColor({r: _this.newColor.r, g: _this.newColor.g, b: _this.newColor.b});
				color.RGBtoHSL();

				switch(_this.radios['group'].active) {
					case 0:
						color.setSaturation(1);
						color.setLightness(1);
						color.HSLtoRGB();
						// Layer 0: Hue, Layer 1: White Horizontal Gradient, Layer 2: Black Gradient
						_this.labels['xyBack'].container.css({
							background: 'rgb(' + color.r + ', ' + color.g + ', ' + color.b + ')'
						});
						_this.labels['xyMiddle'].container.css({
							background: 'url(' + _this.images['whiteHorizontalGradient'].src + ')',
							opacity: 1
						});
						_this.labels['xyFront'].container.css({
							background: 'url(' + _this.images['blackGradient'].src + ')',
							opacity: 1
						});

						_this.labels['zBack'].container.css({
							background: 'url(' + _this.images['hueBar'].src + ')',
							opacity: 1
						});
						_this.labels['zMiddle'].container.css({
							opacity: 0
						});
						_this.labels['zFront'].container.css({
							opacity: 0
						});
						break;
					case 1:
						// Layer 0: Hues, Layer 1: White Opacity, Layer 2: Black Gradient
						_this.labels['xyBack'].container.css({
							background: 'url(' + _this.images['hueGradient'].src + ')'
						});
						_this.labels['xyMiddle'].container.css({
							background: 'rgb(255, 255, 255)',
							opacity: 0
						});
						_this.labels['xyFront'].container.css({
							background: 'url(' + _this.images['blackGradient'].src + ')',
							opacity: 1
						});

						color.setSaturation(1);
						color.setLightness(1);
						color.HSLtoRGB();
						_this.labels['zBack'].container.css({
							background: 'rgb(' + color.r + ', ' + color.g + ', ' + color.b + ')',
							opacity: 1
						});
						_this.labels['zMiddle'].container.css({
							background: 'url(' + _this.images['whiteBar'].src + ')',
							opacity: 1
						});
						_this.labels['zFront'].container.css({
							background: 'rgb(0, 0, 0)',
							opacity: 0 
						});
						break;
					case 2:
						// Layer 0: Hues, Layer 1: White Gradient, Layer 2: Black Opacity
						_this.labels['xyBack'].container.css({
							background: 'url(' + _this.images['hueGradient'].src + ')'
						});
						_this.labels['xyMiddle'].container.css({
							background: 'url(' + _this.images['whiteVerticalGradient'].src + ')',
							opacity: 1
						});
						_this.labels['xyFront'].container.css({
							background: 'url(' + _this.images['blackGradient'].src + ')',
							opacity: 0
						});

						color.setSaturation(1);
						color.setLightness(1);
						color.HSLtoRGB();
						_this.labels['zBack'].container.css({
							background: 'rgb(' + color.r + ', ' + color.g + ', ' + color.b + ')',
							opacity: 1
						});
						_this.labels['zMiddle'].container.css({
							background: 'rgb(255, 255, 255)',
							opacity: 0
						});
						_this.labels['zFront'].container.css({
							background: 'url(' + _this.images['blackBar'].src + ')',
							opacity: 1
						});
						break;
					default:
				}
			},

			updateXYBackColor : function(hue) {
				var color = new WTColor({h: hue, s: 1, l: 1});
				color.HSLtoRGB();
				this.labels['xyBack'].container.css("background-color", "rgb(" + color.r + ", " + color.g + ", " + color.b + ")");
			},

			updateNewColorLabel : function() {

			},

			setSlidesFromZ : function() {
				this.updateSLBackColor(this.newColor.h);
				this.slides['zSlide'].setValue((1 - this.newColor.h) * 100);
			},

			setSlidesFromXY : function() {
				this.slides['xySlide'].setValue({x: this.newColor.s * 100, y: (1 - this.newColor.l) * 100});
			},

			setSlidesFromRGB : function() {
				this.setSlidesFromZ();
				this.setSlidesFromXY();
			},

			setInputFromColor : function() {
				var rgb = this.newColor.getRGB();
				var hsl = this.newColor.getHSL();

				this.inputs['h'].setValue(Math.ceil(hsl.h * 360));
				this.inputs['s'].setValue(Math.ceil(hsl.s * 100));
				this.inputs['l'].setValue(Math.ceil(hsl.l * 100));
				this.inputs['r'].setValue(rgb.r);
				this.inputs['g'].setValue(rgb.g);
				this.inputs['b'].setValue(rgb.b);
				this.inputs['hex'].setValue(this.newColor.getHex());

				this.labels['newColor'].container.css("background-color", "rgb(" + this.newColor.r + ", " + this.newColor.g + ", " + this.newColor.b + ")");
			},

			setRGBInputFromColor : function() {
				var rgb = this.newColor.getRGB();

				this.inputs['r'].setValue(rgb.r);
				this.inputs['g'].setValue(rgb.g);
				this.inputs['b'].setValue(rgb.b);

				this.inputs['hex'].setValue(this.newColor.getHex());

				this.labels['newColor'].container.css("background-color", "rgb(" + this.newColor.r + ", " + this.newColor.g + ", " + this.newColor.b + ")");
			},

			setHSLInputFromColor : function() {
				var hsl = this.newColor.getHSL();

				this.inputs['h'].setValue(Math.floor(hsl.h * 360));
				this.inputs['s'].setValue(Math.floor(hsl.s * 100));
				this.inputs['l'].setValue(Math.floor(hsl.l * 100));

				this.inputs['hex'].setValue(this.newColor.getHex());

				this.labels['newColor'].container.css("background-color", "rgb(" + this.newColor.r + ", " + this.newColor.g + ", " + this.newColor.b + ")");
			},

			changeZ : function() {
				var value = Math.ceil(Math.abs(this.slides['zSlide'].realValue - 1) * 360);
				
				this.newColor.setHue(Math.abs(this.slides['zSlide'].realValue - 1));
				this.newColor.HSLtoRGB();
				var color = new WTColor({h: this.newColor.h, s: 1, l: 1});
				color.HSLtoRGB();

				this.labels['xyBack'].container.css("background-color", "rgb(" + color.r + ", " + color.g + ", " + color.b + ")");

				this.setInputFromColor();
			},

			changeXY : function() {
				var valX = Math.ceil(this.slides['xySlide'].realValue.x * 100);
				var valY = Math.ceil(Math.abs(this.slides['xySlide'].realValue.y - 1) * 100);

				this.newColor.setSaturation(this.slides['xySlide'].realValue.x);
				this.newColor.setLightness(Math.abs(this.slides['xySlide'].realValue.y - 1));
				this.newColor.HSLtoRGB();

				this.setInputFromColor();
			},

			hueInput_handler : function() {
				var value = this.inputs['h'].getValue();
				if(value == "") {
					return 0
				}

				if(WT.util.REGEX.COLOR.test(value)) {
					if(value > 360) {
						value = 360;
					} else if(value < 0) {
						value = 0;
					}
				} else {
					value = 0;
				}

				this.inputs['h'].setValue(value);

				this.newColor.setHue(value / 360);
				this.newColor.HSLtoRGB();

				this.setRGBInputFromColor();
				this.setSlidesFromHue();
			},

			saturationInput_handler : function() {
				var value = this.inputs['s'].getValue();
				if(value == "") {
					return 0;
				}

				if(WT.util.REGEX.COLOR.test(value)) {
					if(value > 100) {
						value = 100;
					} else if(value < 0) {
						value = 0;
					}
				} else {
					value = 0;
				}

				this.inputs['s'].setValue(value);

				this.newColor.setSaturation(value / 100);
				this.newColor.HSLtoRGB();

				this.setRGBInputFromColor();
				this.setSlidesFromSL();
			},

			lightnessInput_handler : function() {
				var value = this.inputs['l'].getValue();
				if(value == "") {
					return 0;
				}

				if(WT.util.REGEX.COLOR.test(value)) {
					if(value > 100) {
						value = 100;
					} else if(value < 0) {
						value = 0;
					}
				} else {
					value = 0;
				}

				this.inputs['l'].setValue(value);

				this.newColor.setLightness(value / 100);
				this.newColor.HSLtoRGB();

				this.setRGBInputFromColor();
				this.setSlidesFromSL();
			},

			redInput_handler : function() {
				var value = this.inputs['r'].getValue();

				if(value == "") {
					return 0;
				}

				if(WT.util.REGEX.COLOR.test(value)) {
					if(value > 255) {
						value = 255;
					} else if(value < 0) {
						value = 0;
					}
				} else {
					value = 0;
				}

				this.inputs['r'].setValue(value);
				
				this.newColor.setRed(value);
				this.newColor.RGBtoHSL();

				this.setHSLInputFromColor();
				this.setSlidesFromRGB();
				
			},

			greenInput_handler : function() {
				var value = this.inputs['g'].getValue();

				if(value == "") {
					return 0;
				}

				if(WT.util.REGEX.COLOR.test(value)) {
					if(value > 255) {
						value = 255;
					} else if(value < 0) {
						value = 0;
					}
				} else {
					value = 0;
				}

				this.inputs['g'].setValue(value);

				this.newColor.setGreen(value);
				this.newColor.RGBtoHSL();

				this.setHSLInputFromColor();
				this.setSlidesFromRGB();
			},

			blueInput_handler : function() {
				var value = this.inputs['b'].getValue();

				if(value == "") {
					return 0;
				}

				if(WT.util.REGEX.COLOR.test(value)) {
					if(value > 255) {
						value = 255;
					} else if(value < 0) {
						value = 0;
					}
				} else {
					value = 0;
				}

				this.inputs['b'].setValue(value);

				this.newColor.setBlue(value);
				this.newColor.RGBtoHSL();

				this.setHSLInputFromColor();
				this.setSlidesFromRGB();
			},

			hexInput_handler : function() {

			},

			revert : function() {
				this.newColor.setRGB(this.oldColor.r, this.oldColor.g, this.oldColor.b);
				this.newColor.RGBtoHSL();

				this.setInputFromColor();
			},

			change_handler : function() {
				this.container.container.trigger("wt:change", {color: this.newColor});
			},

			submitColor : function() {
				this.container.container.trigger("wt:execute", {color: this.newColor});
			},

			cancelColor :function() {
				this.container.container.trigger("wt:execute", {color: this.oldColor});
			},

			addEventListeners : function() {
				var _this = this;
				this.slides['zSlide'].container.on("wt:change", function(e){_this.changeZ();});
				this.slides['xySlide'].container.on("wt:change", function(e){_this.changeXY();});

				this.labels['oldColor'].container.on("wt:click", function(e){_this.revert();});

				this.buttons['ok'].container.on("wt:click", function(e){_this.submitColor();});
				this.buttons['cancel'].container.on("wt:click", function(e){_this.cancelColor();});

				this.inputs['h'].container.on("wt:keyup", function(e){_this.hueInput_handler();});
				this.inputs['s'].container.on("wt:keyup", function(e){_this.saturationInput_handler();});
				this.inputs['l'].container.on("wt:keyup", function(e){_this.lightnessInput_handler();});

				this.inputs['r'].container.on("wt:keyup", function(e){_this.redInput_handler();});
				this.inputs['g'].container.on("wt:keyup", function(e){_this.greenInput_handler();});
				this.inputs['b'].container.on("wt:keyup", function(e){_this.blueInput_handler();});

				this.inputs['hex'].container.on("wt:keyup", function(e){_this.hexInput_handler();});
			}
		};
		colorpicker.constructor(params);

		return colorpicker;
	},

	validateRGBInput : function(val) {
		if(WT.util.REGEX.COLOR.test(val)) {
			if(val > 255) {
				val = 255;
			} else if(val < 0) {
				val = 0;
			}
			return val;
		} else {
			return 0;
		}
	},

	validateHueInput : function(val) {
		if(WT.util.REGEX.COLOR.test(val)) {
			val = parseInt(val);
			if(val > 360) {
				val = 360;
			} else if(val < 0) {
				val = 0;
			}
			return val;
		} else {
			return 0;
		}
	},

	validateSLInput : function(val) {
		if(WT.util.REGEX.COLOR.test(val)) {
			if(val > 100) {
				val = 100;
			} else if(val < 0) {
				val = 0;
			}
			return val;
		} else {
			return 0;
		}
	},

	validateHEXInput : function(val) {
		if(WT.util.REGEX.HEX.test(val)) {
			return true;
		} else {
			return false;
		}
	},

	generateHueBar : function(img) {
		var canvas, context, result, data, color, width, height, currW;

		canvas = document.createElement("canvas");
		canvas.height = img.image.height;
		height = img.image.height;
		canvas.width = img.image.width;
		width = img.image.width

		context = canvas.getContext("2d");

		context.drawImage(img.image, 0, 0);

		data = context.getImageData(0, 0, canvas.width, canvas.height);

		currW = 0;
		currH = 0;
		hue = 1.0;

		color = new WTColor({h: hue, s: 1, l: 1, a: 255});
		color.HSLtoRGB();

		for(var i = 0; i < data.data.length; i += 4)
		{
			data.data[i] = color.r;
			data.data[i+1] = color.g;
			data.data[i+2] = color.b;
			data.data[i+3] = color.a;
			currW += 1;
			if(currW == canvas.width) {
				currW = 0;
				currH += 1;
				color.h = Math.abs((currH / height) - 1);
				color.HSLtoRGB();
			}
		}
		context.putImageData(data, 0, 0);

		return canvas.toDataURL("image/png");
	},

	generateHueGradient : function(img) {
		var canvas, context, result, data, color, width, height, currW;

		canvas = document.createElement("canvas");
		canvas.height = img.image.height;
		height = img.image.height;
		canvas.width = img.image.width;
		width = img.image.width

		context = canvas.getContext("2d");

		context.drawImage(img.image, 0, 0);

		data = context.getImageData(0, 0, canvas.width, canvas.height);

		currW = 0;
		currH = 0;
		hue = 1.0;

		color = new WTColor({h: hue, s: 1, l: 1, a: 255});
		color.HSLtoRGB();

		for(var i = 0; i < data.data.length; i += 4)
		{
			data.data[i] = color.r;
			data.data[i+1] = color.g;
			data.data[i+2] = color.b;
			data.data[i+3] = color.a;
			currW += 1;
			if(currW == canvas.width) {
				currW = 0;
			}
			color.h = (currW / width);
			color.HSLtoRGB();
		}
		context.putImageData(data, 0, 0);

		return canvas.toDataURL("image/png");
	},

	generateBlackGradient : function(img) {
		var canvas, context, result, data, color, width, height, currW, startColor, stopColor;
		canvas = document.createElement("canvas");
		canvas.height = img.image.height;
		height = img.image.height;
		canvas.width = img.image.width;
		width = img.image.width

		context = canvas.getContext("2d");

		context.drawImage(img.image, 0, 0);

		data = context.getImageData(0, 0, canvas.width, canvas.height);

		startColor = new WTColor({r: 0, g: 0, b: 0, a: 0});
		stopColor = new WTColor({r: 0, g: 0, b: 0, a: 255});

		currW = 0;
		currH = 0;
		color = WTColorInterpolate(startColor, stopColor, 0);

		for(var i = 0; i < data.data.length; i += 4)
		{
			data.data[i] = color.r;
			data.data[i+1] = color.g;
			data.data[i+2] = color.b;
			data.data[i+3] = color.a;
			currW += 1;
			if(currW == canvas.width) {
				currW = 0;
				currH += 1;
				color = WTColorInterpolate(startColor, stopColor, (currH / height));
			}
		}
		context.putImageData(data, 0, 0);

		return canvas.toDataURL("image/png");
	},

	generateWhiteHorizontalGradient : function(img) {
		var canvas, context, result, data, color, width, height, currW, startColor, stopColor;
		canvas = document.createElement("canvas");
		canvas.height = img.image.height;
		height = img.image.height;
		canvas.width = img.image.width;
		width = img.image.width

		context = canvas.getContext("2d");

		context.drawImage(img.image, 0, 0);

		data = context.getImageData(0, 0, canvas.width, canvas.height);

		startColor = new WTColor({r: 255, g: 255, b: 255, a: 255});
		stopColor = new WTColor({r: 255, g: 255, b: 255, a: 0});

		currW = 0;
		currH = 0;
		color = WTColorInterpolate(startColor, stopColor, 0);

		for(var i = 0; i < data.data.length; i += 4)
		{
			data.data[i] = color.r;
			data.data[i+1] = color.g;
			data.data[i+2] = color.b;
			data.data[i+3] = color.a;
			currW += 1;
			if(currW == canvas.width) {
				currW = 0;
			}
			color = WTColorInterpolate(startColor, stopColor, (currW / width));
		}
		context.putImageData(data, 0, 0);

		return canvas.toDataURL("image/png");
	},

	generateWhiteVerticalGradient : function(img) {
		var canvas, context, result, data, color, width, height, currW, startColor, stopColor;
		canvas = document.createElement("canvas");
		canvas.height = img.image.height;
		height = img.image.height;
		canvas.width = img.image.width;
		width = img.image.width

		context = canvas.getContext("2d");

		context.drawImage(img.image, 0, 0);

		data = context.getImageData(0, 0, canvas.width, canvas.height);

		startColor = new WTColor({r: 255, g: 255, b: 255, a: 0});
		stopColor = new WTColor({r: 255, g: 255, b: 255, a: 255});

		currW = 0;
		currH = 0;
		color = WTColorInterpolate(startColor, stopColor, 0);

		for(var i = 0; i < data.data.length; i += 4)
		{
			data.data[i] = color.r;
			data.data[i+1] = color.g;
			data.data[i+2] = color.b;
			data.data[i+3] = color.a;
			currW += 1;
			if(currW == canvas.width) {
				currW = 0;
				currH += 1;
				color = WTColorInterpolate(startColor, stopColor, (currH / height));
			}
		}
		context.putImageData(data, 0, 0);

		return canvas.toDataURL("image/png");
	},
};

WTColorPicker = WT.MODULE.colorpick.ColorPicker;