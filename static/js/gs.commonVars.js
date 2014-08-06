/*
	Grigori Stones
	Common Data Loader
	v.1.0
	2014-07-20

	USE:
	$(document).ready(function($) {
		$(gs.commonVars.commonDataListener).on('gsGameDataLoaded', yourLocalFunction);
	});

	you will now have access to the commonVars namespace game data.

*/

$.namespace('gs.commonVars');

gs.commonVars.commonDataListener = {};
gs.commonVars.remainingCount = 0;


// -----------------------------
// common game data
gs.commonVars.ability = {};
gs.commonVars.achievement = {};
gs.commonVars.art = {};
gs.commonVars.tile = {};
gs.commonVars.effect = {};
// -----------------------------


gs.commonVars.initData = function() {
	gs.commonVars.remainingCount = 0;

	gs.commonVars.remainingCount++;
	$.getJSON("/static/assets/data/tsnAbilityData.json", function(json) {
		gs.commonVars.ability = json;
		gs.commonVars.remainingCount--;
		gs.commonVars.checkFinishedLoading();
	});
	
	gs.commonVars.remainingCount++;
	$.getJSON("/static/assets/data/tsnAchievementData.json", function(json) {
		gs.commonVars.achievement = json;
		gs.commonVars.remainingCount--;
		gs.commonVars.checkFinishedLoading();
	});
	
	gs.commonVars.remainingCount++;
	$.getJSON("/static/assets/data/tsnArtData.json", function(json) {
		gs.commonVars.art = json;
		gs.commonVars.remainingCount--;
		gs.commonVars.checkFinishedLoading();
	});
	
	gs.commonVars.remainingCount++;
	$.getJSON("/static/assets/data/tsnTileData.json", function(json) {
		gs.commonVars.tile = json;
		gs.commonVars.remainingCount--;
		gs.commonVars.checkFinishedLoading();
	});
	
};

gs.commonVars.checkFinishedLoading = function() {
	if (gs.commonVars.remainingCount <= 0) {
		$(gs.commonVars.commonDataListener).trigger('gsGameDataLoaded');

	}
};




