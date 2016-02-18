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
    .customBadgeLayout {
        tv-tint-color: rgb(0, 0, 0);
        margin: 0 0 5 0;
    }
    </style>
    </head>
<searchTemplate class="darkBackgroundColor">
<searchField id="search">Search</searchField>
<collectionList>
    
    <separator>
    <button id="send" request="page=1">
    <text>Search <badge class="customBadgeLayout" src="resource://button-dropdown" width="31" height="14" /></text>
    </button>
    </separator>
    
<grid id="grid">
    <header>
    <title>Results</title>
    </header>
    <section>
    </section>
</grid>

<shelf centered="true">
    <section>
    <lockup id="prev" disabled="true">
    <img src="" width="128" height="16"/>
    <title>PREV</title>
    </lockup>
    <lockup id="prev" disabled="true">
    <img src="" width="128" height="16"/>
    <title id="page">PAGE</title>
    </lockup>
    <lockup id="next" disabled="true">
    <img src="" width="128" height="16"/>
    <title>NEXT</title>
    </lockup>
    <button>
    <text>Search <badge class="customBadgeLayout" src="resource://button-dropdown" width="31" height="14" /></text>
    </button>
    
    </section>
</shelf>
</collectionList>
</searchTemplate>
</document>`
}

// TODO: use RedTube API

var Request = function(arg) {
    var doc = getActiveDocument();
    var prev = doc.getElementById("prev");
    var next = doc.getElementById("next");
    var send = doc.getElementById("send");
    prev.setAttribute("disabled", true);
    next.setAttribute("disabled", true);
    send.setAttribute("disabled", true);

    var searchField = doc.getElementById("search");
    var keyboard = searchField.getFeature("Keyboard");

    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        var xml = "<header><title>Results</title></header><section>";
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
        
        var page = 1;
        var regex = /(?:.*)page=(\d*)/;
        if (match = regex.exec(arg)) {
            page = parseInt(match[1]);
        }
        doc.getElementById("page").innerHTML = "Page " + page;

        prev.setAttribute("disabled", 2 > page);
        prev.setAttribute("request", "page="+(page-1));
        next.setAttribute("disabled", 1 > page);
        next.setAttribute("request", "page="+(page+1));
        send.setAttribute("disabled", false);
    }
    
    var url = "http://www.redtube.com/?search=" + escape(keyboard.text) + "&" + arg;
    xhr.open("get",url,true);
    xhr.send();
}

