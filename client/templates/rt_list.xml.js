//  Created by jbyu on 2016-02-18.
//  Copyright (C) 2016 jbyu. All rights reserved.

var Template = function() {
    return `<?xml version="1.0" encoding="UTF-8" ?>
<document>
<head>
    <style>
    .darkBackgroundColor {
        background-color: rgb(20,20,20);
    }
    .noPadding {
        padding: 0;
    }
    .textLayout {
        background-color: rgba(0,0,0,0.6);
        color: #ffffff;
        font-size: 20;
        tv-position: bottom-right;
    }
    .roundedCorner {
        itml-img-treatment: corner-medium;
    }
    </style>
</head>
<stackTemplate theme="dark" class="darkBackgroundColor">
    <identityBanner>
    <title id="title">Template</title>
    <subtitle id="path">&amp;</subtitle>
    <row id="buttons">
        <buttonLockup id="newest">
        <badge src="resource://button-cloud" />
        <title>Newest</title>
        </buttonLockup>
        <buttonLockup id="rated">
        <badge src="resource://star_mask_l" />
        <title>Top Rated</title>
        </buttonLockup>
        <buttonLockup id="viewed">
        <badge src="resource://button-preview" />
        <title>Most Viewed</title>
        </buttonLockup>
        <buttonLockup id="favored">
        <badge src="resource://button-rated" />
        <title>Most Favored</title>
        </buttonLockup>
        <buttonLockup id="longest">
        <badge src="resource://button-more" />
        <title>Longest</title>
        </buttonLockup>
    </row>
    </identityBanner>
<collectionList>
    
    <grid id="grid">
    <section>
    </section>
    </grid>
    
    <shelf centered="true">
    <section>
    <lockup id="prev" >
    <img src="" width="128" height="16"/>
    <title>PREV</title>
    </lockup>
    <lockup id="prev" disabled="true">
    <img src="" width="128" height="16"/>
    <title id="page">PAGE</title>
    </lockup>
    <lockup id="next">
    <img src="" width="128" height="16"/>
    <title>NEXT</title>
    </lockup>
    </section>
    </shelf>
</collectionList>
</stackTemplate>
</document>`;
}

var Request = function(arg) {
    var doc = getActiveDocument();
    var prev = doc.getElementById("prev");
    var next = doc.getElementById("next");
    prev.setAttribute("disabled", true);
    next.setAttribute("disabled", true);

    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        var xml = "<section>";
        var regex = /<a href="(.*)" title="(.*)" class="video-thumb".*\s*<span class="video-duration".*>(.*)<.*\s*<img[^>]*data-src="([^"]*)"/g;
        var match;
        var decode;
        while(match = regex.exec(this.responseText)) {
            decode = match[2].replace(/&(.*);/,"�");
            xml += `<lockup video="${match[1]}">
            <img src="${match[4]}" width="224" height="126" class="roundedCorner" />
            <overlay class="noPadding">
            <title></title>
            <description class="textLayout">${match[3]}</description>
            </overlay>
            <title>${decode}</title>
            </lockup>`;
            //console.log(match);
        }
        xml += "</section>";
        
        //Create parser and new input element
        var domImplementation = doc.implementation;
        var lsParser = domImplementation.createLSParser(1, null);
        var lsInput = domImplementation.createLSInput();
        lsInput.stringData = xml;
        //add the new input element to the document by providing the newly created input, the context,
        //and the operator integer flag (1 to append as child, 2 to overwrite existing children)
        lsParser.parseWithContext(lsInput, doc.getElementById("grid"), 2);
        
        
        var regex = /(?:.*)page=(\d*)/;
        var match;
        var page = 1;
        if (match = regex.exec(arg)) {
            page = parseInt(match[1]);
        }
        var param = arg.split(/[?&]/);
        var orig = param[0];
        var url = orig + "?";
        for (var i = 1; i < param.length; ++i) {
            if (false == /page=/.test(param[i])) {
                url += param[i] + "&";
            }
        }
        
        prev.setAttribute("disabled", 2 > page);
        prev.setAttribute("request",url+"page="+(page-1));
        next.setAttribute("disabled", false);
        next.setAttribute("request",url+"page="+(page+1));
        
        doc.getElementById("title").innerHTML = orig;
        doc.getElementById("path").innerHTML = escape(arg);
        doc.getElementById("page").innerHTML = "Page "+page;

        // buttonLockup in template is unable to focus after selected,
        // walkaround method is replacing with new one.
        var rated = orig+"?sorting=rating";
        var viewed = orig+"?sorting=mostviewed";
        var favored = orig+"?sorting=mostfavored";
        var longest = orig+"?sorting=longest";
        lsInput.stringData = `<buttonLockup id="newest" request="${orig}">
        <badge src="resource://button-cloud" />
        <title>Newest</title>
        </buttonLockup>
        <buttonLockup id="rated" request="${rated}">
        <badge src="resource://star_mask_l" />
        <title>Top Rated</title>
        </buttonLockup>
        <buttonLockup id="viewed" request="${viewed}">
        <badge src="resource://button-preview" />
        <title>Most Viewed</title>
        </buttonLockup>
        <buttonLockup id="favored" request="${favored}">
        <badge src="resource://button-rated" />
        <title>Most Favored</title>
        </buttonLockup>
        <buttonLockup id="longest" request="${longest}">
        <badge src="resource://button-more" />
        <title>Longest</title>
        </buttonLockup>`;
        lsParser.parseWithContext(lsInput, doc.getElementById("buttons"), 2);
    }
    
    var url = "http://www.redtube.com" + arg;
    xhr.open("get",url,true);
    xhr.send();
}
