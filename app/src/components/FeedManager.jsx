var React = require('react'),
    Feed = require('./Feed.jsx'),
    RSSAdder = require('./RSSAdder.jsx');

var FeedManager = React.createClass({
    getInitialState: function () {
        return {
            feedItems: [{title: 'Test1'}, {title: 'Test2'}],
            currentUrl: ''
        };
    },

    urlChange: function (e) {
        e.preventDefault();
        this.setState({currentUrl: e.target.value});
    },

    addRSS: function (e) {
        e.preventDefault();
        var currentFeed = this.state.feedItems;
        currentFeed.push({title: this.state.currentUrl});
        this.setState({feedItems: currentFeed});
    },

    render: function () {
        return (
            <div>
                <h1>Your feed</h1>
                <Feed feedItems={this.state.feedItems} />
                <RSSAdder addRSSCallback={this.addRSS} urlChangeCallback={this.urlChange} />
            </div>
        );
    }
});

module.exports = FeedManager;
