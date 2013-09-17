/* * * * * * * * *
 * Core - Image  *
 * * * * * * * * *
 *
 */

WT.image = {

	Texture : function(params) {
		var image = {
			width: 0,
			height: 0,
			ready: false,
			src: "",
			image: new Image(),

			constructor : function(params) {
				for(key in params) {
					if(this[key] != undefined) {
						this[key] = params[key];
					}
				}
				this.addEventListeners();
				
				if(this.src != "") {
					this.load(this.src);
				}
			},

			generate : function() {
				this.image.width = this.width;
				this.image.height = this.height;
				this.image.src = WT.image.fill(this, {r: 255, g: 255, b: 255, a: 255});
			},

			load : function(src) {
				this.src = src;
				this.image.src = src;
			},

			setData : function(data) {
				this.image.src = data;
				this.src = data;
			},

			getData : function() {
				var canvas, g, data;
				var canvas = document.createElement("canvas");
				canvas.width = this.width;
				canvas.height = this.height;
				
				g = canvas.getContext("2d");
				g.drawImage(this.image, 0, 0);
				
				return canvas.toDataURL("image/png");
			},

			getImageUrl : function() {
				return this.image.toDataURL("image/png");
			},

			load_handler : function(e, _this) {
				_this.ready = true;
				_this.width = _this.image.width;
				_this.height = _this.image.height;
			},

			error_handler : function(e, _this) {
				_this.ready = false;
			},

			deconstructor : function() {

			},

			addEventListeners : function() {
				var _this = this;
				$(this.image)
					.on("load", function(e){_this.load_handler(e, _this);})
					.on("error", function(e){_this.error_handler(e, _this);});
			}
		};
		image.constructor(params);

		return image;
	},

	fill : function(img, color) {
		var canvas, context, result, data;
		canvas = document.createElement("canvas");
		canvas.height = img.image.height;
		canvas.width = img.image.width;

		context = canvas.getContext("2d");

		context.drawImage(img.image, 0, 0);

		data = context.getImageData(0, 0, canvas.width, canvas.height);

		for(var i = 0; i < data.data.length; i += 4)
		{
			data.data[i] = color.r;
			data.data[i+1] = color.g;
			data.data[i+2] = color.b;
			data.data[i+3] = color.a;
		}
		context.putImageData(data, 0, 0);

		return canvas.toDataURL("image/png");
	},

	rotate : function(img, degree) {
		var canvas, context, x, y;
		canvas = document.createElement("canvas");
		canvas.height = img.image.height;
		canvas.width = img.image.width;

		context = canvas.getContext("2d");

		context.rotate(wtUtil.degreeToRadian(degree));

		switch(degree) {
			case 90:
				x = 0;
				y = -(canvas.height);
				break;
			case 180:
				x = -(canvas.width);
				y = -(canvas.height);
				break;
			case 270:
				x = -(canvas.width);
				y = 0;
				break;
			default:
				x = 0;
				y = 0;
		}
		context.drawImage(img.image, x, y);

		return canvas.toDataURL("image/png");
	},

	gradient : function(img, startColor, stopColor, direction) {
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

	multiply : function(image1, image2, ratio) {

	},

	darken : function(image) {

	},

	lighten : function(image) {

	},

	monochrome : function(image) {

	}
};

WTImage = WT.image.Texture;
WTImageRotate = WT.image.rotate;
WTImageFill = WT.image.fill;
WTImageGradient = WT.image.gradient;