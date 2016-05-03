var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var FeedItem;
(function (FeedItem_1) {
    var FeedItem = (function (_super) {
        __extends(FeedItem, _super);
        function FeedItem() {
            _super.apply(this, arguments);
        }
        FeedItem.prototype.render = function () {
            return (React.createElement("li", null, React.createElement("a", {target: "_blank", href: this.props.feedItem.url}, React.createElement("h4", null, this.props.feedItem.title))));
        };
        return FeedItem;
    }(React.Component));
    FeedItem_1.FeedItem = FeedItem;
})(FeedItem || (FeedItem = {}));
/// <reference path="./FeedItem.tsx" />
var Feed;
(function (Feed_1) {
    var Feed = (function (_super) {
        __extends(Feed, _super);
        function Feed() {
            _super.apply(this, arguments);
        }
        Feed.prototype.createFeedItem = function (feedItem, index) {
            return React.createElement(FeedItem.FeedItem, {key: index + feedItem.title, feedItem: feedItem});
        };
        Feed.prototype.render = function () {
            return (React.createElement("div", null, React.createElement("h2", null, this.props.title), React.createElement("h3", null, this.props.url), React.createElement("ul", null, this.props.feedItems.map(this.createFeedItem.bind(this)))));
        };
        return Feed;
    }(React.Component));
    Feed_1.Feed = Feed;
})(Feed || (Feed = {}));
/// <reference path="./Feed.tsx" />
var RSS;
(function (RSS_1) {
    var RSS = (function (_super) {
        __extends(RSS, _super);
        function RSS() {
            _super.apply(this, arguments);
        }
        RSS.prototype.render = function () {
            return (React.createElement("li", null, React.createElement("div", null, React.createElement(Feed.Feed, {title: this.props.feed.title, url: this.props.feed.url, feedItems: this.props.feed.feedItems}))));
        };
        return RSS;
    }(React.Component));
    RSS_1.RSS = RSS;
})(RSS || (RSS = {}));
/// <reference path="./RSS.tsx" />
var RSSList;
(function (RSSList_1) {
    var RSSList = (function (_super) {
        __extends(RSSList, _super);
        function RSSList() {
            _super.apply(this, arguments);
        }
        RSSList.prototype.createRSS = function (feed, index) {
            return React.createElement(RSS.RSS, {feed: feed, key: feed.title + index});
        };
        RSSList.prototype.render = function () {
            return (React.createElement("div", null, React.createElement("ul", null, this.props.rssItems.map(this.createRSS.bind(this)))));
        };
        return RSSList;
    }(React.Component));
    RSSList_1.RSSList = RSSList;
    ;
})(RSSList || (RSSList = {}));
// var RSSAdder = require('./RSSAdder.jsx');
/// <reference path="./RSSList.tsx" />
// import { RSSList } from "./RSSList";
// <RSSAdder addRSSCallback={this.props.addRSS} />
// <RSSList rssItems={this.props.rssItems} />
var RSSListManager;
(function (RSSListManager_1) {
    var RSSListManager = (function (_super) {
        __extends(RSSListManager, _super);
        function RSSListManager() {
            _super.apply(this, arguments);
        }
        RSSListManager.prototype.render = function () {
            return (React.createElement("div", null, React.createElement("h1", null, "Your feed"), React.createElement(RSSList.RSSList, {rssItems: this.props.rssItems})));
        };
        return RSSListManager;
    }(React.Component));
    RSSListManager_1.RSSListManager = RSSListManager;
})(RSSListManager || (RSSListManager = {}));
/// <reference path="../components/RSSListManager.tsx" />
var ControllerMain;
(function (ControllerMain) {
    var RSSController = (function () {
        function RSSController() {
            this.factory = React.createFactory(RSSListManager.RSSListManager);
            this.state = {};
            this.scheduler = Bacon.interval(1000, true);
            this.init();
        }
        RSSController.prototype.init = function () {
            this.scheduler.flatMap(this.getAllFeeds.bind(this)).onValue(this.changeState.bind(this));
            // TODO init state from localstorage
            this.changeState({
                'rssItems': [{
                        'url': 'http://cdn2.cad-comic.com/rss.xml',
                        'title': "rssTitle",
                        'webUrl': "webUrl",
                        'feedItems': []
                    }] // TODO maybe refactor to an object with hashes of urls
            });
        };
        RSSController.prototype.getAllFeeds = function (_) {
            // [S<responses>] -> S<[responses]>
            var urls = this.state.rssItems.map(function (i) { return i.url; });
            var promises = urls.map(this.getPromiseForUrl.bind(this));
            var zippedPromises = Bacon.zipAsArray(promises);
            return zippedPromises.map(this.mapResponsesToRSSItems.bind(this));
        };
        RSSController.prototype.changeState = function (newState) {
            this.state = jQuery.extend(this.state, newState);
            ReactDOM.render(this.factory({
                'rssItems': this.state.rssItems,
                'addRSS': this.createOrUpdateRSSFromUrl
            }), document.getElementById('content'));
        };
        RSSController.prototype.getPromiseForUrl = function (url) {
            // returns 1 promise from 1 ajax call for 1 url
            return Bacon.fromPromise(jQuery.ajax({ url: url }));
        };
        RSSController.prototype.mapResponseToRSSItem = function (response) {
            var response = typeof (response) === 'string'
                ? $.parseXML(response)
                : response, $response = $(response), $channel = $response.find('channel').first(), rssTitle = $channel.find('title').first().html(), rssUrl = $channel.find('link').first().attr('href'), webUrl = $channel.find('link')[1].innerHTML, $rssItems = $channel.find('item');
            var myResponse = {
                'title': rssTitle,
                'url': rssUrl,
                'webUrl': webUrl,
                'feedItems': $rssItems.map(function (_, elem) {
                    var $elem = $(elem);
                    return {
                        'title': $elem.find('title').first().html(),
                        'url': $elem.find('link').first().html()
                    };
                }).toArray()
            };
            return myResponse;
        };
        RSSController.prototype.createOrUpdateRSSFromUrl = function (url) {
            var currentRSSItems = this.state.rssItems, urls = currentRSSItems.map(function (rssItem) {
                return rssItem.url;
            });
            if (urls.indexOf(url) === -1) {
                this.createRSSFromUrl(url);
            }
            else {
                this.updateRSSFromUrl(url);
            }
        };
        RSSController.prototype.updateRSSFromUrl = function (url) {
            // TODO
        };
        RSSController.prototype.createRSSFromUrl = function (url) {
            var responseStream = Bacon.fromPromise(jQuery.ajax({
                url: url
            }));
            // xml2js alternatives that are not async
            var newRssItemStream = responseStream.map(this.mapResponseToRSSItem.bind(this));
            newRssItemStream.onValue(function (newRssItem) {
                var currentRSSItems = this.state.rssItems;
                currentRSSItems.push(newRssItem);
                this.changeState({
                    rssItems: currentRSSItems
                });
            });
        };
        RSSController.prototype.mapResponsesToRSSItems = function (responses) {
            return {
                rssItems: responses.map(this.mapResponseToRSSItem.bind(this))
            };
        };
        return RSSController;
    }());
    ControllerMain.RSSController = RSSController;
})(ControllerMain || (ControllerMain = {}));
// import xml2json = require('simple-xml2json');
//
// declare var xml2json: any;
//
// export function RSSController (): any {
//     var state: any = {},
//         factory = React.createFactory(RSSListManager),
//         scheduler = Bacon.interval(1000, true);
//
//     function init () {
//         scheduler.flatMap(getAllFeeds).onValue(changeState);
//         // TODO init state from localstorage
//         changeState({
//             'rssItems': [] // TODO maybe refactor to an object with hashes of urls
//         });
//     }
//
//     function getAllFeeds (_) {
//         // [S<responses>] -> S<[responses]>
//         var urls = state.rssItems.map(function (i) {return i.url});
//         var promises = urls.map(getPromiseForUrl)
//         var zippedPromises = Bacon.zipAsArray(promises);
//
//         return zippedPromises.map(mapResponsesToRSSItems);
//     }
//
//
//     function changeState (newState) {
//         state = jQuery.extend(state, newState);
//         ReactDOM.render(
//             React.createElement("div", {}, ["Holo"]),
//             document.getElementById('content')
//         );
//         // ReactDOM.render(
//         //     factory({
//         //         'rssItems': state.rssItems,
//         //         'addRSS': createOrUpdateRSSFromUrl
//         //     }),
//         //     document.getElementById('content')
//         // );
//     }
//
//     function createOrUpdateRSSFromUrl (url) {
//         var currentRSSItems = state.rssItems,
//             urls = currentRSSItems.map(function (rssItem) {
//                 return rssItem.url;
//             });
//
//         if (urls.indexOf(url) === -1) {
//             createRSSFromUrl(url);
//         } else {
//             updateRSSFromUrl(url);
//         }
//     }
//
//     function updateRSSFromUrl (url) {
//         // TODO
//     }
//
//     function createRSSFromUrl (url) {
//         var responseStream = Bacon.fromPromise(jQuery.ajax({
//             url: url
//         }));
//
//         // xml2js alternatives that are not async
//         var newRssItemStream = responseStream.map(mapResponseToRSSItem);
//
//         newRssItemStream.onValue(function (newRssItem) {
//             var currentRSSItems = state.rssItems;
//             currentRSSItems.push(newRssItem);
//             changeState({
//                 rssItems: currentRSSItems
//             });
//         });
//     }
//
//     function mapResponsesToRSSItems (responses) {
//         return {
//             rssItems: responses.map(mapResponseToRSSItem)
//         };
//     }
//
//     function mapResponseToRSSItem (response) {
//         var responseString = typeof(response) === 'string'
//             ? response
//             : new XMLSerializer().serializeToString(response),
//             result = xml2json.parser(responseString),
//             rssChannel = result.rss.channel,
//             rssTitle = rssChannel.title,
//             rssUrl = rssChannel['atom%3alink'].href,
//             webUrl = rssChannel.link,
//             rssItems = rssChannel.item;
//
//         return {
//             'title': rssTitle,
//             'url': rssUrl,
//             'webUrl': webUrl,
//             'feedItems': rssItems.map(function (item) {
//                 return {
//                     'title': item.title,
//                     'url': item.link
//                 }
//             })
//         }
//     }
//
//     return {
//         init: init
//     }
// }
/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="./controllers/main.ts" />
var main;
(function (main) {
    var MyController = ControllerMain.RSSController;
    function Run() {
        var Main = new MyController();
    }
    main.Run = Run;
})(main || (main = {}));
