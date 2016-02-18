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
    .roundedCorner {
        itml-img-treatment: corner-medium;
    }
    </style>
</head>
<stackTemplate theme="dark" class="darkBackgroundColor">
    <identityBanner>
    <title id="title">Categories</title>
    </identityBanner>
<collectionList>
    <grid id="grid">
    <section>
    </section>
    </grid>
</collectionList>
</stackTemplate>
</document>`;
}

var Request = function(arg) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        var regex = /<div class="video">\s*<a href="(.*)" title="(.*)">\s*<img[^>]*\sdata-src="([^"]*)"/g;
        var match;
        var title;
        var xml = "<section>";
        while(match = regex.exec(this.responseText)) {
            xml += `<lockup template="${resourceLoader.BASEURL}templates/rt_list.xml.js" request="${match[1]}">
            <img src="${match[3]}" width="180" height="135" class="roundedCorner" />
            <title>${match[2]}</title>
            </lockup>`;
            //console.log(xml);
            //section.insertAdjacentHTML('beforeend',xml);
        }
        xml += "</section>";
        
        var doc = getActiveDocument();
        //Create parser and new input element
        var domImplementation = doc.implementation;
        var lsParser = domImplementation.createLSParser(1, null);
        var lsInput = domImplementation.createLSInput();
        lsInput.stringData = xml;
        //add the new input element to the document by providing the newly created input, the context,
        //and the operator integer flag (1 to append as child, 2 to overwrite existing children)
        lsParser.parseWithContext(lsInput, doc.getElementById("grid"), 2);
    }
    xhr.open("get","http://www.redtube.com/categories",true);
    xhr.send();
}
