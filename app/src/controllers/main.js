var $ = require('jquery'),
    xml2json = require('simple-xml2json'),
    ReactDOM = require('react-dom'),
    RSSListManagerFactory = require('../components/RSSListManager.jsx'),
    bacon = require('baconjs');


var RSSController = (function () {
    var state = {},
        factory = RSSListManagerFactory;

    function init () {
        // TODO init state from localstorage


        changeState({
            'rssItems': [] // TODO maybe refactor to an object with hashes of urls
        });
    }

    function changeState (newState) {
        state = $.extend(state, newState);

        ReactDOM.render(
            factory({
                'rssItems': state.rssItems,
                'addRSS': createOrUpdateRSSFromUrl
            }),
            document.getElementById('content')
        );
    }

    function createOrUpdateRSSFromUrl (url) {
        var currentRSSItems = state.rssItems,
            urls = currentRSSItems.map(function (rssItem) {
                return rssItem.url;
            });

        if (urls.indexOf(url) === -1) {
            createRSSFromUrl(url);
        } else {
            updateRSSFromUrl(url);
        }
    }

    function updateRSSFromUrl (url) {
        // TODO
    }

    function createRSSFromUrl (url) {
        var responseStream = bacon.fromPromise($.ajax({
            method: 'get',
            url: url
        }));

        // xml2js alternatives that are not async
        var newRssItemStream = responseStream.map(function (response) {
            var result = xml2json.parser(new XMLSerializer().serializeToString(response)),
                rssChannel = result.rss.channel,
                rssTitle = rssChannel.title,
                rssUrl = rssChannel.link,
                rssItems = rssChannel.item;

            return {
                'title': rssTitle,
                'url': rssUrl,
                'feedItems': rssItems.map(function (item) {
                    return {
                        'title': item.title,
                        'url': item.link
                    }
                })
            }
        });

        newRssItemStream.onValue(function (newRssItem) {
            var currentRSSItems = state.rssItems;
            currentRSSItems.push(newRssItem);
            changeState({
                rssItems: currentRSSItems
            });
        });
    }

    return {
        init: init
    }
})();

module.exports = RSSController;
