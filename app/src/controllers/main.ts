/// <reference path="../components/RSSListManager.tsx" />


declare var xml2json: any;

module ControllerMain {
    export class RSSController {
        private state: any;
        private factory: any = React.createFactory(RSSListManager.RSSListManager);
        private scheduler: Bacon.Observable<any, boolean>;

        constructor () {
            this.state = {};
            this.scheduler = Bacon.interval(1000, true);

            this.init();
        }

        init () {
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
        }

        getAllFeeds (_): Bacon.Observable<any, any> {
            // [S<responses>] -> S<[responses]>
            var urls = this.state.rssItems.map(function (i) {return i.url});
            var promises = urls.map(this.getPromiseForUrl.bind(this));
            var zippedPromises = Bacon.zipAsArray(promises);

            return zippedPromises.map(this.mapResponsesToRSSItems.bind(this));
        }

        changeState (newState) {
            this.state = jQuery.extend(this.state, newState);
            ReactDOM.render(
                this.factory({
                    'rssItems': this.state.rssItems,
                    'addRSS': this.createOrUpdateRSSFromUrl
                }),
                document.getElementById('content')
            );
        }

        getPromiseForUrl (url): any {
            // returns 1 promise from 1 ajax call for 1 url
            return Bacon.fromPromise(jQuery.ajax({url: url}));
        }

        mapResponseToRSSItem (response): any {
            var response = typeof(response) === 'string'
                ? $.parseXML(response)
                : response,
                $response = $(response),
                $channel = $response.find('channel').first(),
                rssTitle = $channel.find('title').first().html(),
                rssUrl = $channel.find('link').first().attr('href'),
                webUrl = $channel.find('link')[1].innerHTML,
                $rssItems = $channel.find('item');

            var myResponse = {
                'title': rssTitle,
                'url': rssUrl,
                'webUrl': webUrl,
                'feedItems': $rssItems.map(function (_, elem) {
                    var $elem = $(elem);
                    return {
                        'title': $elem.find('title').first().html(),
                        'url': $elem.find('link').first().html()
                    }
                }).toArray()
            }

            return myResponse;
        }

        createOrUpdateRSSFromUrl (url): void {
            var currentRSSItems = this.state.rssItems,
                urls = currentRSSItems.map(function (rssItem) {
                    return rssItem.url;
                });

            if (urls.indexOf(url) === -1) {
                this.createRSSFromUrl(url);
            } else {
                this.updateRSSFromUrl(url);
            }
        }

        updateRSSFromUrl (url): void {
            // TODO
        }

        createRSSFromUrl (url): void {
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
        }

        mapResponsesToRSSItems (responses): any {
            return {
                rssItems: responses.map(this.mapResponseToRSSItem.bind(this))
            };
        }
    }
}



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
