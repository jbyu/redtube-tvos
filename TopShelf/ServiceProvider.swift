//
//  ServiceProvider.swift
//  TopShelf
//
//  Created by jbyu on 2016/2/18.
//  Copyright (C) 2016 jbyu. All rights reserved.
//

import Foundation
import TVServices

class ServiceProvider: NSObject, TVTopShelfProvider {

    override init() {
        super.init()
    }
    
    let topShelfStyle: TVTopShelfContentStyle = .Sectioned
    
    let query = "http://api.redtube.com/?data=redtube.Videos.searchVideos&output=json&thumbsize=big&category=japanese"
    
    var topShelfItems: [TVContentItem] {
        var items: [TVContentItem] = []
        let semaphore = dispatch_semaphore_create(0)
        let url = NSURL(string: query)
        let task = NSURLSession.sharedSession().dataTaskWithURL(url!) {(data, response, error) in
            let sectionTitle = "RedTube"
            guard let sectionIdentifier = TVContentIdentifier(identifier: sectionTitle, container: nil)
                else { fatalError("Error creating content identifier for section item.") }
            guard let sectionItem = TVContentItem(contentIdentifier: sectionIdentifier)
                else { fatalError("Error creating section content item.") }
            sectionItem.title = sectionTitle
            sectionItem.topShelfItems = []
            
            let json = JSON(data: data!)
            for video in json["videos"].arrayValue {
                sectionItem.topShelfItems?.append(self.contentItemWithJSON(video["video"]))
            }
            items.append(sectionItem)
            dispatch_semaphore_signal(semaphore)
        }
        task.resume()
        dispatch_semaphore_wait(semaphore, DISPATCH_TIME_FOREVER)
        return items;
    }
    
    /// Returns a `TVContentItem` for a `JSON`.
    private func contentItemWithJSON(dataItem: JSON) -> TVContentItem {
        guard let contentIdentifier = TVContentIdentifier(identifier: "video", container: nil)
            else { fatalError("Error creating content identifier.") }
        guard let contentItem = TVContentItem(contentIdentifier: contentIdentifier)
            else { fatalError("Error creating content item.") }
        
        contentItem.title = dataItem["title"].stringValue
        contentItem.imageURL = NSURL(string: dataItem["thumb"].stringValue)
        contentItem.displayURL = NSURL(string: "redtube://display/"+dataItem["video_id"].stringValue)
        contentItem.playURL = NSURL(string: "redtube://play/"+dataItem["video_id"].stringValue)
        contentItem.imageShape = TVContentItemImageShape.Wide

        print(contentItem.title)
        
        return contentItem
    }
}

