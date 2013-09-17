WT.color = {
	Color : function(params) {
		var color = {
			r: 0,
			g: 0,
			b: 0,
			a: 0,
			h: 0,
			s: 0,
			l: 0,

			constructor : function(params) {
				for(key in params) {
					if(this[key] != undefined) {
						this[key] = params[key];
					}
				}
			},

			setRGB : function(r, g, b) {
				this.r = r;
				this.g = g;
				this.b = b;
				this.RGBtoHSL();
			},

			setHSL : function(h, s, l) {
				this.h = h;
				this.s = s;
				this.l = l;
				this.HSLtoRGB();
			},

			setAlpha : function(alpha) {
				this.a = alpha;
			},

			setRGBA : function(r, g, b, a) {
				this.setRGB(r, g, b);
				this.setAlpha(a);
			},

			getRGB : function() {
				return {r: this.r, g: this.g, b: this.b};
			},

			getHSL : function() {
				return {h: this.h, s: this.s, l: this.l};
			},

			setRed : function(r) {
				this.r = r;
			},

			setGreen : function(g) {
				this.g = g;
			},

			setBlue : function(b) {
				this.b = b;
			},

			setHue : function(h) {
				this.h = h;
			},

			setSaturation : function(s) {
				this.s = s;
			},

			setLightness : function(l) {
				this.l = l;
			},

			getAlpha : function() {
				return this.a;
			},

			getRGBA : function() {
				return {r: this.r, g: this.g, b: this.b, a: this.a};
			},

			getRGBAFloat : function() {
				return {r: this.toFloat(this.r), g: this.toFloat(this.g), b: this.toFloat(this.b), a: this.toFloat(this.a)};
			},

			getRGBAInt : function() {
				return {r: this.toInt(this.r), g: this.toInt(this.g), b: this.toInt(this.b), a: this.toInt(this.a)};
			},

			RGBtoHSL : function() {
				var h, s, l, r, g, b, cmax, cmin, redc, greenc, bluec;
				r = this.r;
				g = this.g;
				b = this.b;

				cmax = (r > g) ? r : g;
				if(b > cmax) {
					cmax = b;
				}
				cmin = (r < g) ? r : g;
				if(b < cmin) {
					cmin = b;
				}

				l = cmax / 255.0;
				if(cmax != 0) {
					s = (cmax - cmin) / cmax;
				} else {
					s = 0;
				}
				if(s == 0) {
					h = 0;
				} else {
					redc = (cmax - r) / (cmax - cmin);
					greenc = (cmax - g) / (cmax - cmin);
					bluec = (cmax - b) / (cmax - cmin);
					if(r == cmax) {
						h = bluec - greenc;
					} else if(g == cmax) {
						h = 2.0 + redc - bluec;
					} else {
						h = 4.0 + greenc - redc;
					}
					h = h / 6.0;
					if(h < 0) {
						h = h + 1.0;
					}
				}
				this.h = h;
				this.s = s;
				this.l = l;
			},
			/*
			RGBtoHSL : function() {
				var tRed, tGreen, tBlue;
				tRed = this.r;
				tGreen = this.g;
				tBlue = this.b;
				
				tRed /= 255, tGreen /= 255, tBlue /= 255;
				var max = Math.max(tRed, tGreen, tBlue), min = Math.min(tRed, tGreen, tBlue);
				this.h, this.s, this.l = (max + min) / 2;

				if(max == min) {
					this.h = this.s = 0; // achromatic
				} else {
					var d = max - min;
					this.s = this.l > 0.5 ? d / (2 - max - min) : d / (max + min);
					switch(max) {
						case tRed: this.h = (tGreen - tBlue) / d + (tGreen < tBlue ? 6 : 0); break;
						case tGreen: this.h = (tBlue - tRed) / d + 2; break;
						case tBlue: this.h = (tRed - tGreen) / d + 4; break;
					}
					this.h /= 6;
				}
			},
			*/
			
			HSLtoRGB : function() {
				var r, g, b, h, hue, s, l, f, p, q, t;
				r = 0;
				g = 0;
				b = 0;
				hue = this.h;
				s = this.s;
				l = this.l;

				if(this.s == 0) {
					r = Math.floor(l * 255 + 0.5);
					g = Math.floor(l * 255 + 0.5);
					b = Math.floor(l * 255 + 0.5);
				} else {
					h = (hue - Math.floor(hue)) * 6.0;
					f = h - Math.floor(h);
					p = l * (1.0 - s);
					q = l * (1.0 - s * f);
					t = l * (1.0 - (s * (1.0 - f)));
					switch(Math.floor(h)) {
						case 0:
							r = (l * 255.0 + 0.5);
							g = (t * 255.0 + 0.5);
							b = (p * 255.0 + 0.5);
							break;
						case 1:
							r = (q * 255.0 + 0.5);
							g = (l * 255.0 + 0.5);
							b = (p * 255.0 + 0.5);
							break;
						case 2:
							r = (p * 255.0 + 0.5);
							g = (l * 255.0 + 0.5);
							b = (t * 255.0 + 0.5);
							break;
						case 3:
							r = (p * 255.0 + 0.5);
							g = (q * 255.0 + 0.5);
							b = (l * 255.0 + 0.5);
							break;
						case 4:
							r = (t * 255.0 + 0.5);
							g = (p * 255.0 + 0.5);
							b = (l * 255.0 + 0.5);
							break;
						case 5:
							r = (l * 255.0 + 0.5);
							g = (p * 255.0 + 0.5);
							b = (q * 255.0 + 0.5);
							break;
					}
				}
				this.r = Math.floor(r);
				this.g = Math.floor(g);
				this.b = Math.floor(b);
			},

			/*
			HSLtoRGB : function() {
				if(this.s == 0){
					this.r = this.g = this.b = this.l; // achromatic
				}else{
					function hue2rgb(p, q, t){
						if(t < 0) t += 1;
						if(t > 1) t -= 1;
						if(t < 1/6) return p + (q - p) * 6 * t;
						if(t < 1/2) return q;
						if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
						return p;
					}

					var q = this.l < 0.5 ? this.l * (1 + this.s) : this.l + this.s - this.l * this.s;
					var p = 2 * this.l - q;
					this.r = hue2rgb(p, q, this.h + 1/3);
					this.g = hue2rgb(p, q, this.h);
					this.b = hue2rgb(p, q, this.h - 1/3);
				}

				this.r = Math.floor(this.r * 255);
				this.g = Math.floor(this.g * 255);
				this.b = Math.floor(this.b * 255);
			},
			*/
			getHex : function() {
			    return ((1 << 24) + (this.r << 16) + (this.g << 8) + this.b).toString(16).slice(1);
			},
			
			setHex : function(hex) {
				var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

			    this.r = parseInt(result[1], 16);
			    this.g = parseInt(result[2], 16);
			    this.b = parseInt(result[3], 16);
			    
			    this.RGBtoHSL();
			},

			toFloat : function(value) {
				if(value != 0) {
					return value / 255;
				} else {
					return 0.0;
				}
			},

			toInt : function(value) {
				return value * 255;
			}
		};
		color.constructor(params);

		return color;
	},

	interpolate : function(color1, color2, scale) {
		var color = new WTColor({r: 0, g: 0, b: 0, a: 255});
		var c0 = color1.getRGBAFloat();
		var c1 = color2.getRGBAFloat();

		color.r = c0.r + (c1.r - c0.r) * scale;
		color.g = c0.g + (c1.g - c0.g) * scale;
		color.b = c0.b + (c1.b - c0.b) * scale;
		color.a = c0.a + (c1.a - c0.a) * scale;

		return color.getRGBAInt();
	}
}

WTColor = WT.color.Color;
WTColorInterpolate = WT.color.interpolate;