var React = require('react'),
    RSSList = require('./RSSList.jsx'),
    RSSAdder = require('./RSSAdder.jsx'),
    $ = require('jquery');

var RSSListManager = React.createClass({
    getInitialState: function () {
        return {
            rssItems: [
                {
                    'title': 'test',
                    'url': 'http://www.google.com',
                    'feedItems': [{title: 'Test1'}, {title: 'Test2'}]
                }
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
        var currentRSSItems = this.state.rssItems;
        currentRSSItems.push({title: this.state.currentUrl});
        this.setState({rssItems: currentRSSItems, currentUrl: ''});
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
