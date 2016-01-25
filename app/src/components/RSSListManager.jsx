var React = require('react'),
    RSSList = require('./RSSList.jsx'),
    RSSAdder = require('./RSSAdder.jsx'),
    $ = require('jquery'),
    xml2js = require('xml2js');

var RSSListManager = React.createClass({
    getInitialState: function () {
        return {
            rssItems: [
                // {
                //     'title': 'test',
                //     'url': 'http://www.google.com',
                //     'feedItems': [{title: 'Test1'}, {title: 'Test2'}]
                // }
            ],
            currentUrl: ''
        };
    },

    urlChange: function (e) {
        e.preventDefault();
        this.setState({currentUrl: e.target.value});
    },

    addRSS: function (e) {
        e.preventDefault();
        var currentRSSItems = this.state.rssItems,
        self = this;

        $.ajax({
            url: this.state.currentUrl
        }).complete(function (response) {
            xml2js.parseString(response.responseText, function (error, result) {
                stuff = result
                var rssChannel = result.rss.channel[0],
                    rssTitle = rssChannel.title[0],
                    rssUrl = rssChannel.link[0],
                    rssItems = rssChannel.item;

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

                self.setState({
                    rssItems: currentRSSItems,
                    currentUrl: ''
                });
            });
        });


    },

    render: function () {
        return (
            <div>
                <h1>Your feed</h1>
                <RSSAdder addRSSCallback={this.addRSS} urlChangeCallback={this.urlChange} />
                <RSSList rssItems={this.state.rssItems} />
            </div>
        );
    }
});

module.exports = RSSListManager;
