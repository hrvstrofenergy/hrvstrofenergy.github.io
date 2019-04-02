$(function() {
	//establish variables
	var $displayTable = $("#displayTable");
	var $displayTable2 = $("#displayTable2");
	var loginNames = ["AntonioAsh", "BraindeadSurki", "Chachava", "Crittle888", "Ember798", "FibroWolf", "HrvstrOfEnergy","Liza_M", "MuuMuuFace", "NeenSheep", "TheOptionalOath", "Princess___Lissy", "TheQuietestGirl"]
	var urlString = "";
	var urlString2 = "";
	var statusString = "";
	var htmlString = "";
	var htmlString2 = "";
  var liveStreamers = [];
  var offStreamers = [];

//create urlString with loginName array
	for (var i = 0; i < loginNames.length; i++){
		if (loginNames.length > i-1) {
			urlString += "login=" + loginNames[i] + "&";
			statusString += "user_login=" + loginNames[i] + "&";
		} else {
			urlString += "login=" + loginNames[i];
			statusString += "user_login=" + loginNames[i];
		}

//get user data
	}
	$.ajax({
		type: 'GET',
		url: "https://api.twitch.tv/helix/users?" + urlString,
		headers: {
			'Client-ID': '7b4w6b4fjx7llf1dcudr2fhpnr5uxr'
		},
		success: function(profileData) {
			console.log(profileData);

			// createTable(profileData);
			checkStatus(profileData);
		}
	});

//display userdata
	function createTable (profileData) {

		for (var j = 0; j < profileData.data.length; j++){
			htmlString +=
			"<div class=\"row\"><div class=\"col span-1-of-12\"><img src=\"" +
			profileData.data[j].profile_image_url +
			"\" height=\"70px\" width=\"70px\"></div><div class=\"col span-4-of-12\"><h2><a href=\"https://www.twitch.tv/" +
			profileData.data[j].display_name +
			"\" target=\"_blank\">" +
			profileData.data[j].display_name +
			"</a></h2><h5 id=\"" +
			profileData.data[j].display_name +
			"\">Offline</h5>" +
			"</div></div>";

		}

//console.log(htmlString);
		displayTable.insertAdjacentHTML("beforeend", htmlString);
		checkStatus(profileData);
	};

//check to see if users are offline or live
	function checkStatus(profileData) {
    console.log("StatusString = " + statusString);
		$.ajax({
			type: 'GET',
			url: "https://api.twitch.tv/helix/streams?" + statusString,
			headers: {
				'Client-ID': '7b4w6b4fjx7llf1dcudr2fhpnr5uxr'
			},
			success: function(newData) {
				console.log(newData);

			if (newData.data.length === 0) {
					console.log('new data 0?');
				} else {
					for (var i = 0; i < newData.data.length; i++) {
						if (newData.data[i].type == 'live') {
							if (checkIDMatch(newData.data[i].user_id, profileData)) {
								liveStreamers.push(newData.data[i].user_name);
							} else {
								offStreamers.push(newData.data[i].user_name);
							}
						} else {
							offStreamers.push(newData.data[i].user_name);
						}
					}


					// for (var i=0; i<newData.data.length; i++){
					// 	for (var j = 0; j<profileData.data.length; j++){
					// 		console.log(newData.data[i].user_id);
					// 		console.log(profileData.data[j].id);
					// 		if(newData.data[i].user_id === profileData.data[j].id) {
					// 			var profileStatus = document.getElementById(profileData.data[j].display_name);
					// 			var descName = "desc"+ profileData.data[j].display_name;
					// 			var newDescription = document.getElementById(descName);
					// 			profileStatus.innerHTML = "<strong class=\"live\">Live</strong>";
          //       liveStreamers.push(profileData.data[j].display_name);
          //       console.log("Type = ? "+newData.data[j].type);
					// 		} else {
          //       offStreamers.push(profileData.data[j].display_name);
          //       console.log("OffStreamers = "+offStreamers);
          //     }
					// 	}
					// }



          }
					for (var i = 0; i < profileData.data.length; i++) {
						if (!liveStreamers.includes(profileData.data[i].display_name) && !offStreamers.includes(profileData.data[i].display_name)) {
							console.log("if yes");
							offStreamers.push(profileData.data[i].display_name);
						} else {
							console.log("if no");

						}
					}
					newTable(profileData);
				}

		});
	};

	function checkIDMatch(newID, profileData) {
		for (var i = 0; i < profileData.data.length; i++) {
			if (newID == profileData.data[i].id) {
				return true;
			}
		}
		return false;
	}

function newTable(profileData) {
	console.log('In newTable but am I really?');
	htmlString = '<div id="online-title" style="background-color:; color:">ONLINE</div>'
	if (liveStreamers.length == 0) {
		console.log('All offline');
		htmlString += '<p class="offlineMsg">Casters are offline. :(</p>'
	} else {
		console.log('In else but am I really?');
		for (var j = 0; j < liveStreamers.length; j++){
			console.log(liveStreamers[j]);
			htmlString += "<li>" + "<img src=\"" + getImg(liveStreamers[j], profileData) +
			"\" height=\"\" width=\"\"  oncontextmenu=\"return false;\">" + "<div class=\"avatar\">" +
			"<a href=\"https://www.twitch.tv/" +
			liveStreamers[j] +
			"\" target=\"_blank\">" +
			liveStreamers[j] + "</a></div></li><p>\n</p>";
		}



	}
	htmlString += '<div id="offline-title" style="background-color:; color:">Offline</div>'
	if (offStreamers.length == 0) {
		htmlString += '<p>All streamers online</p>'
	} else {
		for (var j = 0; j < offStreamers.length; j++){
			htmlString += "<li>" + "<img src=\"" + getImg(offStreamers[j], profileData) +
			"\" height=\"\" width=\"\"  oncontextmenu=\"return false;\">" + "<div class=\"avatar\">" +
			"<a href=\"https://www.twitch.tv/" +
			offStreamers[j] +
			"\" target=\"_blank\">" +
			offStreamers[j] + "</a></div></li><p>\n</p>";
		}
	}

//console.log(htmlString);
	displayTable.insertAdjacentHTML("beforeend", htmlString);
};

function getImg(streamer, profileData){
	for (var i = 0; i < profileData.data.length; i++) {
		if (profileData.data[i].display_name == streamer) {
			return profileData.data[i].profile_image_url;
		}
	}
	return "";
}


//   function getStreamsofOnline() {
// 		console.log('In getStreamsofOnline but am I really?');
// 		var string ="<div style=\"text-align: center\">";
//     for (var i = 0; i < liveStreamers.length; i++) {
//
//       var source = "https://player.twitch.tv/?channel="+liveStreamers[i];
//       var iframe = "<iframe src="+ source + " height='360' width='640' frameborder='0' scrolling='yes' allowfullscreen='true'></iframe>";
//       console.log("iFrame = " + iframe);
// 			string += iframe;
//
//   }
// 	string += "</div>"
// 	document.getElementById('streams').insertAdjacentHTML('beforeend', string);
// };
});
