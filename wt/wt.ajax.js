/*------------
 * WebTop Ajax
 * -----------
 * Webtop needs a stable and fully supported Ajax library to handle communication with the
 * PHP backend and applications. Here I'll try to start writing most of the functionality
 * of the AJAX book functionalty and then extend it with whatever functionality I'll need
 * throughout development of WebTop!
 * 
 */
WT.ajax = {
	_createXHR : function() {   
		try { return new XMLHttpRequest(); } catch(e) {}
		try { return new ActiveXObject("Msxml2.XMLHTTP.6.0"); } catch (e) {}
		try { return new ActiveXObject("Msxml2.XMLHTTP.3.0"); } catch (e) {}
		try { return new ActiveXObject("Msxml2.XMLHTTP"); } 	  catch (e) {}
		try { return new ActiveXObject("Microsoft.XMLHTTP"); }  catch (e) {}
								  	           
		return null;
	},
		
	sendRequest : function(url, payload, callback) {
		var xhr = WT.ajax._createXHR();
		if(xhr)
		{
			xhr.open("POST", url, false);
			xhr.setRequestHeader("Content-Type", "text/xml");
			xhr.setRequestHeader("Content-Disposition", "attachement");
			xhr.setRequestHeader("Content-Disposition", "filename=map.xml");
			xhr.onreadystatechange = function() {
				if (xhr.readyState == 4 && xhr.status == 200)
				{	
					callback(xhr);
				}
			};
			xhr.send(payload);
		}
	}
};