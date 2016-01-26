var $ = require('jquery'),
    xml2js = require('xml2js'),
    ReactDOM = require('react-dom'),
    RSSListManagerFactory = require('../components/RSSListManager.jsx');


var RSSController = (function () {
    var state = {},
        factory = RSSListManagerFactory;

    function init () {
        changeState({
            'rssItems': []
        });
    }

    function changeState (newState) {
        state = $.extend(state, newState);
        ReactDOM.render(
            factory({
                'rssItems': state.rssItems,
                'addRSS': createRSSFromUrl,
                'urlChange': urlChange
            }),
            document.getElementById('content')
        );
    }

    function urlChange (e) {
        e.preventDefault();
        changeState({currentUrl: e.target.value});
    }

    function createRSSFromUrl () {
        $.ajax({
            url: state.currentUrl
        }).complete(function (response) {
            xml2js.parseString(response.responseText, function (error, result) {
                var rssChannel = result.rss.channel[0],
                    rssTitle = rssChannel.title[0],
                    rssUrl = rssChannel.link[0],
                    rssItems = rssChannel.item,
                    currentRSSItems = state.rssItems;

                currentRSSItems.push({
                    'title': rssTitle,
                    'url': rssUrl,
                    'feedItems': rssItems.map(function (item) {
                        return {
                            'title': item.title[0],
                            'url': item.link[0]
                        }
                    })
                });

                changeState({
                    rssItems: currentRSSItems,
                    currentUrl: ''
                });
            });
        });
    }

    return {
        init: init
    }
})();

module.exports = RSSController;
