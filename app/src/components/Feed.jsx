var React = require('react'),
    FeedItem = require('./FeedItem.jsx');

var Feed = React.createClass({
    createFeedItem: function (feedItem, index) {
        return <FeedItem key={index + feedItem.title} feedItem={feedItem} />;
    },

    render: function () {
        var self = this;
        return (
            <ul>
                {this.props.feedItems.map(self.createFeedItem)}
            </ul>
        );
    }
});

module.exports = Feed;
