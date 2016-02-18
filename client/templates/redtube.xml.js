//  Created by jbyu on 2016-02-18.
//  Copyright (C) 2016 jbyu. All rights reserved.

var Template = function() { return `<?xml version="1.0" encoding="UTF-8" ?>
<document>
  <menuBarTemplate>
    <menuBar>
        <menuItem template="${this.BASEURL}templates/rt_videos.xml.js" presentation="menuBarItemPresenter" request="/">
        <title>Videos</title>
        </menuItem>
        <menuItem template="${this.BASEURL}templates/rt_categories.xml.js" presentation="menuBarItemPresenter" request="true">
        <title>Categories</title>
        </menuItem>
        <menuItem template="${this.BASEURL}templates/rt_search.xml.js" presentation="menuBarItemPresenter">
        <title>Search</title>
        </menuItem>
    </menuBar>
  </menuBarTemplate>
</document>`
}