/*
	Grigori Stones
	Campaign Story Assembler
	2014-07-07
*/

$.namespace('gs.campaignStory');

gs.campaignStory.chapter = "";
gs.campaignStory.art = {};
gs.campaignStory.campaign = {};
gs.campaignStory.factionLegend = {"human":{"displayName":"Freemasons", "defaultArt":"tile_face_human_soldier"}, "zombie":{"displayName":"Zombies", "defaultArt":"tile_face_zombie_footpad"}, "vampire":{"displayName":"Vampires", "defaultArt":"tile_face_vampire_warrior"}, "werewolf":{"displayName":"Werewolves", "defaultArt":"tile_face_werewolf_warrior"}};
gs.campaignStory.targetNode = false;
gs.campaignStory.maxStage = -1;



gs.campaignStory.loadChapter = function(whichChapter, targetNodeId, clearFirst) {
	gs.campaignStory.targetNode = $('#' + targetNodeId);
	gs.campaignStory.chapter = whichChapter;
	
	$.getJSON("/static/assets/data/tsnArtData.json", function(json) {
		gs.campaignStory.art = json;

		$.getJSON("/static/assets/data/tsnCampaignData.json", function(json) {
			gs.campaignStory.campaign = json;
			gs.campaignStory.displayChapter(clearFirst);
		});

	});
	
};

gs.campaignStory.setMaxStage = function(maxStage) {
	gs.campaignStory.maxStage = maxStage;
};

gs.campaignStory.displayChapter = function(clearFirst) {

	if (clearFirst) {
		gs.campaignStory.targetNode.empty();

		var introString = "";
		for (var j=0; j<gs.campaignStory.campaign['stages'][0]['storyParchments'].length; j++) {
			introString += "<p>" + gs.campaignStory.campaign['stages'][0]['storyParchments'][j].replace(/\n/g, '<br />') + "</p>";
		}
		gs.campaignStory.targetNode.append('<div class="well alignRight"><h3>Prologue</h3>' + introString + '</div><br/><br/>');

	}

	for (var i=1; i<gs.campaignStory.campaign['stages'].length; i++) {

		// bail out if they haven't gotten this far.  spoilers and all.
		if (gs.campaignStory.maxStage != -1 && gs.campaignStory.maxStage < i) return;

		if (gs.campaignStory.campaign['stages'][i]['chapterName'] == gs.campaignStory.chapter) {

			// found a stage belonging to this chapter.
			gs.campaignStory.targetNode.append('<p style="text-align:center; font-weight:bold;">' + gs.campaignStory.campaign['stages'][i]['name'] + '</p>');

			// parchments
			for (var j=0; j<gs.campaignStory.campaign['stages'][i]['storyParchments'].length; j++) {

				if (gs.campaignStory.campaign['stages'][i]['storyParchments'][j].charAt(0) == "{") {
					var chapterHeaderData = jQuery.parseJSON(gs.campaignStory.campaign['stages'][i]['storyParchments'][j]);

					gs.campaignStory.targetNode.append("<h3>" + chapterHeaderData['title'] + "</h3>");
					gs.campaignStory.targetNode.append("<h4>" + chapterHeaderData['subtitle'] + "</h4>");

				} else {
					gs.campaignStory.targetNode.append("<p>" + gs.campaignStory.campaign['stages'][i]['storyParchments'][j].replace(/\n/g, '<br />') + "</p>");
				}
			}
			gs.campaignStory.targetNode.append('<br/>');

			// collect the player data
			var factionArt = gs.campaignStory.factionLegend[gs.campaignStory.campaign['stages'][i]['playerFaction']]['defaultArt'];
			var playerData = {"playerName":"The Player", "headImage":"assets/ui/playerselect/portrait_player_one_67891084f0685da2a85b0e5341c7ed1e.png", "battleImage":gs.campaignStory.art[factionArt]['portraitUrl']};

			// talking heads - pre-battle
			var leftHead = "";
			for (var j=0; j<gs.campaignStory.campaign['stages'][i]['talkingHeads'].length; j++) {
				if (gs.campaignStory.campaign['stages'][i]['talkingHeads'][j]['turn'] == 1) {
					if (leftHead == "") leftHead = gs.campaignStory.campaign['stages'][i]['talkingHeads'][j]['who'];

					var headName = playerData['playerName'];
					if (gs.campaignStory.campaign['stages'][i]['talkingHeads'][j]['who'] != "player") headName = gs.campaignStory.campaign['stages'][i]['talkingHeads'][j]['who'];

					var headImage = playerData['headImage'];
					if (gs.campaignStory.campaign['stages'][i]['talkingHeads'][j]['who'] != "player") headImage = gs.campaignStory.art[gs.campaignStory.campaign['mobs'][gs.campaignStory.campaign['stages'][i]['talkingHeads'][j]['who']]['art']]['portraitUrl'];

					if (gs.campaignStory.campaign['stages'][i]['talkingHeads'][j]['who'] == leftHead) {
						gs.campaignStory.targetNode.append('<div class="leftHead" style="clear:both;"><img src="/static/' + headImage + '" width="80" height="80" style="float:left;"/><p class="headDialog" style="float:left; width:50%; padding:10px;"><b>' + headName + ':</b><br/>' + gs.campaignStory.campaign['stages'][i]['talkingHeads'][j]['dialog'] + '</p></div>');

					} else {
						gs.campaignStory.targetNode.append('<div class="rightHead" style="clear:both;"><img src="/static/' + headImage + '" width="80" height="80" style="float:right;"/><p class="headDialog" style="float:right; width:50%; padding:10px;"><b>' + headName + ':</b><br/>' + gs.campaignStory.campaign['stages'][i]['talkingHeads'][j]['dialog'] + '</p></div>');
					}
				}
			}
			gs.campaignStory.targetNode.append('<div style="clear:both;"></div>');


			// battle starts
			// each battle is player faction warrior vs. opponent mob.
			var opponentImage = gs.campaignStory.art[gs.campaignStory.campaign['mobs'][gs.campaignStory.campaign['stages'][i]['opponent']]['art']]['portraitUrl'];
			gs.campaignStory.targetNode.append('<div class="well" style="text-align:center; margin-top:20px;"><img src="/static/' + playerData['battleImage'] + '" width="80" height="80" style="float:left;"/><img src="/static/' + opponentImage + '" width="80" height="80" style="float:right;"/><h5>BATTLE BEGINS</h5><h3>' + gs.campaignStory.factionLegend[gs.campaignStory.campaign['stages'][i]['playerFaction']]['displayName'] + ' VS ' + gs.campaignStory.factionLegend[gs.campaignStory.campaign['stages'][i]['aiFaction']]['displayName'] + '</h3></div>');


			// talking heads - mid-battle
			leftHead = "";
			for (var j=0; j<gs.campaignStory.campaign['stages'][i]['talkingHeads'].length; j++) {
				if (gs.campaignStory.campaign['stages'][i]['talkingHeads'][j]['turn'] != 1 && gs.campaignStory.campaign['stages'][i]['talkingHeads'][j]['turn'] != -1) {
					if (leftHead == "") leftHead = gs.campaignStory.campaign['stages'][i]['talkingHeads'][j]['who'];

					var headName = playerData['playerName'];
					if (gs.campaignStory.campaign['stages'][i]['talkingHeads'][j]['who'] != "player") headName = gs.campaignStory.campaign['stages'][i]['talkingHeads'][j]['who'];

					var headImage = playerData['headImage'];
					if (gs.campaignStory.campaign['stages'][i]['talkingHeads'][j]['who'] != "player") headImage = gs.campaignStory.art[gs.campaignStory.campaign['mobs'][gs.campaignStory.campaign['stages'][i]['talkingHeads'][j]['who']]['art']]['portraitUrl'];

					if (gs.campaignStory.campaign['stages'][i]['talkingHeads'][j]['who'] == leftHead) {
						gs.campaignStory.targetNode.append('<div class="leftHead" style="clear:both;"><img src="/static/' + headImage + '" width="80" height="80" style="float:left;"/><p class="headDialog" style="float:left; width:50%; padding:10px;"><b>' + headName + ':</b><br/>' + gs.campaignStory.campaign['stages'][i]['talkingHeads'][j]['dialog'] + '</p></div>');

					} else {
						gs.campaignStory.targetNode.append('<div class="rightHead" style="clear:both;"><img src="/static/' + headImage + '" width="80" height="80" style="float:right;"/><p class="headDialog" style="float:right; width:50%; padding:10px;"><b>' + headName + ':</b><br/>' + gs.campaignStory.campaign['stages'][i]['talkingHeads'][j]['dialog'] + '</p></div>');
					}
				}
			}
			gs.campaignStory.targetNode.append('<div style="clear:both;"></div>');


			// battle over!
			gs.campaignStory.targetNode.append('<div class="well"><img src="/static/' + playerData['battleImage'] + '" width="80" height="80" style="float:left;" /><h2 style="margin-left:100px;">' + gs.campaignStory.factionLegend[gs.campaignStory.campaign['stages'][i]['playerFaction']]['displayName'] + ' are victorious!</h2><div style="clear:both;"></div></div>');


			// talking heads - post-battle
			leftHead = "";
			for (var j=0; j<gs.campaignStory.campaign['stages'][i]['talkingHeads'].length; j++) {
				if (gs.campaignStory.campaign['stages'][i]['talkingHeads'][j]['turn'] == -1) {
					if (leftHead == "") leftHead = gs.campaignStory.campaign['stages'][i]['talkingHeads'][j]['who'];

					var headName = playerData['playerName'];
					if (gs.campaignStory.campaign['stages'][i]['talkingHeads'][j]['who'] != "player") headName = gs.campaignStory.campaign['stages'][i]['talkingHeads'][j]['who'];

					var headImage = playerData['headImage'];
					if (gs.campaignStory.campaign['stages'][i]['talkingHeads'][j]['who'] != "player") headImage = gs.campaignStory.art[gs.campaignStory.campaign['mobs'][gs.campaignStory.campaign['stages'][i]['talkingHeads'][j]['who']]['art']]['portraitUrl'];

					if (gs.campaignStory.campaign['stages'][i]['talkingHeads'][j]['who'] == leftHead) {
						gs.campaignStory.targetNode.append('<div class="leftHead" style="clear:both;"><img src="/static/' + headImage + '" width="80" height="80" style="float:left;"/><p class="headDialog" style="float:left; width:50%; padding:10px;"><b>' + headName + ':</b><br/>' + gs.campaignStory.campaign['stages'][i]['talkingHeads'][j]['dialog'] + '</p></div>');

					} else {
						gs.campaignStory.targetNode.append('<div class="rightHead" style="clear:both;"><img src="/static/' + headImage + '" width="80" height="80" style="float:right;"/><p class="headDialog" style="float:right; width:50%; padding:10px;"><b>' + headName + ':</b><br/>' + gs.campaignStory.campaign['stages'][i]['talkingHeads'][j]['dialog'] + '</p></div>');
					}
				}
			}
			gs.campaignStory.targetNode.append('<div style="clear:both;"></div>');
			
			gs.campaignStory.targetNode.append('<br/><p style="text-align:center; font-weight:bold;">###</p><br/>');
		}
	}

};




