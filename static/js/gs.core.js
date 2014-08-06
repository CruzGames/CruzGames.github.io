/*
	Grigori Stones
	Core Javascript
	v.0.1
	2013-06-01
*/

/*
 * namespacing support.
 */
jQuery.namespace = function() {
    var a=arguments, o=null, i, j, d;
    for (i=0; i<a.length; i=i+1) {
        d=a[i].split(".");
        o=window;
        for (j=0; j<d.length; j=j+1) {
            o[d[j]]=o[d[j]] || {};
            o=o[d[j]];
        }
    }
    return o;
};

/**
 * $.parseParams - parse query string paramaters into an object.
 * use: var urlParams = $.parseParams(document.location.search);
 */
(function($) {
    var re = /([^&=]+)=?([^&]*)/g;
    var decode = function(str) {
        return decodeURIComponent(str.replace(/\+/g, ' '));
    };
    $.parseParams = function(query) {
        var params = {}, e;
        if (query) {
            if (query.substr(0, 1) == '?') {
                query = query.substr(1);
            }

            while (e = re.exec(query)) {
                var k = decode(e[1]);
                var v = decode(e[2]);
                if (params[k] !== undefined) {
                    if (!$.isArray(params[k])) {
                        params[k] = [params[k]];
                    }
                    params[k].push(v);
                } else {
                    params[k] = v;
                }
            }
        }
        return params;
    };
})(jQuery);

$.namespace('gs.core');


gs.core.setNavHighlight = function() {
    var myUrl = document.location.toString();
    var myAbsolutePath = "/" + myUrl.split("/").slice(3).join("/").toLowerCase();
    var mainFound = false;
    var subFound = false;

    var navLocation;
    $('ul.nav li a').each(function(index) {
        if (!mainFound || !subFound) {
            navLocation = $(this).attr('href').toLowerCase();
            if (myAbsolutePath == "/") {
                if (navLocation == myAbsolutePath) { 
                    $(this).parent().addClass('active');
                    mainFound = true;
                    subFound = true;
                }
            } else if (navLocation != "/" && myAbsolutePath.toLowerCase().indexOf(navLocation) === 0) {
                if (navLocation.split("/").length > 2) {
                    subFound = true;
                    $(this).parent().addClass('active');
                } else {
                    mainFound = true;
                    $(this).parent().addClass('active');
                }
            }
        }
    });
};

gs.core.getQueryParameterByName = function(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
    var results = regex.exec(location.search);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

gs.core.notify = function(msg) {
	//console.log('notification');
	$().toastmessage('showNoticeToast', msg);
};


gs.core.processJsonAlerts = function(data) {
	//console.log('processing alert');
	if (data.error != undefined) {
		gs.core.notify(data.error);
		return false;
	}
	
	if (data.GSNOTIFY != undefined) {
		gs.core.notify(data.GSNOTIFY);
		//console.log('message notified');
		delete data.GSNOTIFY;
	} else {
		console.log('no message found.');
		//console.log(data);
		//console.log(data['GSNOTIFY']);
	}
	
	return true;
};

gs.core.ajaxSpinner = function(ajaxTarget) {
	// the target is a jquery selector string
	if (ajaxTarget == '') {
		// shroud everything and drop the spinner into its own modal
	} else {
		// drop in a localized spinner
		var targetNode = $(ajaxTarget);
		targetNode.empty();

        // TODO: we need to actually create the image class...  duh.
		targetNode.append('<span class="loadingImage ajaxSpinner"></span>');
	}
};

gs.core.stickyOn = function() {
    //console.log('setting up sticky');
    var scrollingDiv = $(".stickyElement");

    if (scrollingDiv.css('position') == 'static') return;

    if (scrollingDiv.length == 0) return;
    //console.log(scrollingDiv);

    var offsetTop = scrollingDiv.offset().top - 60;
    $(window).scroll(function(){
        if ($(this).scrollTop() > offsetTop) {
            scrollingDiv.stop().animate({"marginTop": ($(window).scrollTop() - offsetTop) + "px"}, "slow" );            
        } else {
            scrollingDiv.stop().animate({"marginTop": "0px"}, "slow" );         
        }
    }); 
};

gs.core.generateSequentialId = function(prefix, maxPlaces, value) {
    // use:
    //  gs.core.generateSequentialId("GS", 5, 13);
    // outputs:
    //  GS00013

    var padding = "";
    for (var i=0; i<maxPlaces; i++) {
        padding = padding + "0";
    }
    var s = padding + value;
    return prefix + s.substr(s.length-maxPlaces);
}


gs.core.intToOrdinalWords = function(num, toLower) {
    var first_word = ['eth','First','Second','Third','Fourth','Fifth','Sixth','Seventh','Eighth','Ninth','Tenth','Eleventh','Twelfth','Thirteenth','Fourteenth','Fifteenth','Sixteenth','Seventeenth','Eighteenth','Nineteenth','Twentieth'];
    var second_word = ['','','Twenty','Thirty','Forty','Fifty','Sixty','Seventy','Eighty','Ninety'];

    if(num <= 20)
        return first_word[num];

    numStr = "" + num;

    // for when i need more than 99, split string here would be awesome.
    var first_num = numStr.charAt(1);
    var second_num = numStr.charAt(0);

    var finalWords = second_word[parseInt(second_num)] + '-' + first_word[parseInt(first_num)]
    finalWords = finalWords.replace(/y-eth/g,"ieth");

    if (toLower) {
        finalWords = finalWords.toLowerCase();
    }

    return finalWords;
}


gs.core.intToWords = function(s) {
    var th = ['', 'thousand', 'million', 'billion', 'trillion'];
    var dg = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
    var tn = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
    var tw = ['twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

    s = s.toString();
    s = s.replace(/[\, ]/g, '');
    if (s != parseFloat(s)) return 'not a number';
    var x = s.indexOf('.');
    if (x == -1) x = s.length;
    if (x > 15) return 'too big';
    var n = s.split('');
    var str = '';
    var sk = 0;
    for (var i = 0; i < x; i++) {
        if ((x - i) % 3 == 2) {
            if (n[i] == '1') {
                str += tn[Number(n[i + 1])] + ' ';
                i++;
                sk = 1;
            } else if (n[i] != 0) {
                str += tw[n[i] - 2] + ' ';
                sk = 1;
            }
        } else if (n[i] != 0) {
            str += dg[n[i]] + ' ';
            if ((x - i) % 3 == 0) str += 'hundred ';
            sk = 1;
        }
        if ((x - i) % 3 == 1) {
            if (sk) str += th[(x - i - 1) / 3] + ' ';
            sk = 0;
        }
    }
    if (x != s.length) {
        var y = s.length;
        str += 'point ';
        for (var i = x + 1; i < y; i++) str += dg[n[i]] + ' ';
    }
    return str.replace(/\s+/g, ' ');
}



