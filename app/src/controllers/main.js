var $ = require('jquery'),
    xml2json = require('simple-xml2json'),
    ReactDOM = require('react-dom'),
    RSSListManagerFactory = require('../components/RSSListManager.jsx'),
    bacon = require('baconjs');

var RSSController = (function () {
    var state = {},
        factory = RSSListManagerFactory,
        scheduler = bacon.interval(1000, true);

    function init () {
        scheduler.flatMap(getAllFeeds).onValue(changeState);
        // TODO init state from localstorage
        changeState({
            'rssItems': [] // TODO maybe refactor to an object with hashes of urls
        });
    }

    function getAllFeeds (_) {
        // [S<responses>] -> S<[responses]>
        var urls = state.rssItems.map(function (i) {return i.url});
        var promises = urls.map(getPromiseForUrl)
        var zippedPromises = bacon.zipAsArray(promises);

        return zippedPromises.map(mapResponsesToRSSItems);
    }

    function getPromiseForUrl (url) {
        // returns 1 promise from 1 ajax call for 1 url
        return bacon.fromPromise($.ajax({url: url}));
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
            url: url
        }));

        // xml2js alternatives that are not async
        var newRssItemStream = responseStream.map(mapResponseToRSSItem);

        newRssItemStream.onValue(function (newRssItem) {
            var currentRSSItems = state.rssItems;
            currentRSSItems.push(newRssItem);
            changeState({
                rssItems: currentRSSItems
            });
        });
    }

    function mapResponsesToRSSItems (responses) {
        return {
            rssItems: responses.map(mapResponseToRSSItem)
        };
    }

    function mapResponseToRSSItem (response) {
        var responseString = typeof(response) === 'string'
            ? response
            : new XMLSerializer().serializeToString(response),
            result = xml2json.parser(responseString),
            rssChannel = result.rss.channel,
            rssTitle = rssChannel.title,
            rssUrl = rssChannel['atom%3alink'].href,
            webUrl = rssChannel.link,
            rssItems = rssChannel.item;

        return {
            'title': rssTitle,
            'url': rssUrl,
            'webUrl': webUrl,
            'feedItems': rssItems.map(function (item) {
                return {
                    'title': item.title,
                    'url': item.link
                }
            })
        }
    }

    return {
        init: init
    }
})();

module.exports = RSSController;
