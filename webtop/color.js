WT.color = {
	Color : function(red, green, blue) {
		var color = {
			r : 0 || red,
			g : 0 || green,
			b : 0 || blue,
			
			h : 0.0,
			s : 0.0,
			l : 0.0,
			
			setRGB : function(red, green, blue) {
				this.r = red;
				this.g = green;
				this.b = blue;
			},
			
			setRed : function(red) {
				this.setRGB(red, this.g, this.b);
			},
			
			setGreen : function(green) {
				this.setRGB(this.r, green, this.b);
			},
			
			setBlue : function(blue) {
				this.setRGB(this.r, this.g, blue);
			},
			
			setHSL : function(hue, sat, light) {
				this.h = hue;
				this.s = sat;
				this.l = light;
			},
			
			setHue : function(hue) {
				this.setHSL(hue, this.s, this.l);
			},
			
			setSaturation : function(sat) {
				this.setHSL(this.h, sat, this.l);
			},
			
			setLight : function(light) {
				this.setHSL(this.h, this.s, light);
			},
			
			RGBtoHSL : function() {
				var tRed, tGreen, tBlue;
				tRed = this.r;
				tGreen = this.g;
				tBlue = this.b;
				
				tRed /= 255, tGreen /= 255, tBlue /= 255;
				var max = Math.max(tRed, tGreen, tBlue), min = Math.min(tRed, tGreen, tBlue);
				this.h, this.s, this.l = (max + min) / 2;

				/*
				if(max == min){
					this.h = this.s = 0; // achromatic*/
				if(max == min) {
					this.s = 0; // achromatic
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
			
			getHex : function() {
			    return "#" + ((1 << 24) + (this.r << 16) + (this.g << 8) + this.b).toString(16).slice(1);
			},
			
			setHex : function(hex) {
				var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

			    this.r = parseInt(result[1], 16);
			    this.g = parseInt(result[2], 16);
			    this.b = parseInt(result[3], 16);
			    
			    this.RGBtoHSL();
			},
			
			toString : function() {
				return "Color Object | R : " + this.r +
						 ", G : " + this.g +
						 ", B : " + this.b +
						 "| H : " + this.h +
						 ", S : " + this.s +
						 ", L : " + this.l +
						 " | Hex : " + this.getHex();
			},
			
			toCSS : function() {
				return "rgb(" + this.r + ", " + this.g + ", " + this.b
				+ ")";
			}
		};
		return color;
	}	
};