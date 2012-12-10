WT.anim = {
	animateElement : function(element, styles, time) {
		var frame = 0;
		var frames = Math.floor(time / WT.ANIM_SPEED);
		var currentTime = 0;
		
		var interval = setInterval(nextFrame, WT.ANIM_SPEED);
		
		function nextFrame() {
			if(frame >= frames) {
				clearInterval(interval);
				return;
			}
			
			frame++;
			
			for(style in styles) {
				element.style[style] = WT.anim.interpolate(styles[style].start, styles[style].end, Math.floor(frames / frame)) + "px";
			}
		}
	},
	
	interpolate : function(srcValue, dstValue, pos) {
		return srcValue + ((dstValue - srcValue) / pos);
	}
};