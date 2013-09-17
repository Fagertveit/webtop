WT.util = {
	EPSILON : 0.000001,
	REGEX : {
		COLOR: /([\d]{1,3})$/i,
		HEX: /^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i
	},

	radianToDegree : function(radian) {
		return radian * (180/Math.PI);
	},

	degreeToRadian : function(degree) {
		return degree * (Math.PI/180);
	},
	/*
	distance : function(point1, point2) {
		var vector = new gSaw.geometry.Vector2d(point1.X, point1.Y);
		vector = vector.subtract(new gSaw.geometry.Vector2d(point2.X, point2.Y));

		return vector.length();
	},
	*/
};
wtUtil = WT.util;