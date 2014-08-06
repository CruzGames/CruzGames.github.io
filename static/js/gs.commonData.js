/*
	Grigori Stones
	Common Data Loader
	v.0.1
	2013-11-07

	NOTE: THIS IS THE BACKEND TOOLS VERSION
	FRONTEND VERSION IS CALLED: gs.commonVars.js
*/

$.namespace('gs.commonData');


gs.commonData.dataCallback = false;
gs.commonData.remainingCount = 0;

gs.commonData.ability = {};
gs.commonData.achievement = {};
gs.commonData.art = {};
gs.commonData.campaign = {};
gs.commonData.tile = {};
gs.commonData.ui = {};
gs.commonData.manifest = {};


gs.commonData.initData = function(myCallback) {
	gs.commonData.dataCallback = myCallback;
	gs.commonData.remainingCount = 0;

	gs.commonData.remainingCount++;
	$.getJSON("/tools/campaign/gamedata?whichData=abilities", function(json) {
		gs.commonData.ability = json;
		gs.commonData.remainingCount--;
		gs.commonData.checkFinishedLoading();
	});
	
	gs.commonData.remainingCount++;
	$.getJSON("/tools/campaign/gamedata?whichData=achievements", function(json) {
		gs.commonData.achievement = json;
		gs.commonData.remainingCount--;
		gs.commonData.checkFinishedLoading();
	});
	
	gs.commonData.remainingCount++;
	$.getJSON("/static/assets/data/tsnArtData.json", function(json) {
		gs.commonData.art = json;
		gs.commonData.remainingCount--;
		gs.commonData.checkFinishedLoading();
	});
	
	gs.commonData.remainingCount++;
	$.getJSON("/tools/campaign/gamedata?whichData=campaign", function(json) {
		gs.commonData.campaign = json;
		gs.commonData.remainingCount--;
		gs.commonData.checkFinishedLoading();
	});
	
	gs.commonData.remainingCount++;
	$.getJSON("/tools/campaign/gamedata?whichData=tiles", function(json) {
		gs.commonData.tile = json;
		gs.commonData.remainingCount--;
		gs.commonData.checkFinishedLoading();
	});
	
	gs.commonData.remainingCount++;
	$.getJSON("/static/assets/data/tsnUiData.json", function(json) {
		gs.commonData.ui = json;
		gs.commonData.remainingCount--;
		gs.commonData.checkFinishedLoading();
	});
	
	//gs.commonData.remainingCount++;
	//$.getJSON("/tools/campaign/manifest", function(json) {
	//	gs.commonData.manifest = json;
	//	gs.commonData.remainingCount--;
	//	gs.commonData.checkFinishedLoading();
	//});
	
};

gs.commonData.checkFinishedLoading = function() {
	if (gs.commonData.remainingCount <= 0) {
		gs.commonData.dataCallback();
	}
};




