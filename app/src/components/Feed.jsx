var React = require('react'),
    FeedItem = require('./FeedItem.jsx');

var Feed = React.createClass({
    createFeedItem: function (feedItem, index) {
        return <FeedItem key={index + feedItem.title} feedItem={feedItem} />;
    },

    render: function () {
        var self = this;
        return (
            <div>
                <h2>{this.props.title}</h2>
                <h3>{this.props.url}</h3>
                <ul>
                    {this.props.feedItems.map(self.createFeedItem)}
                </ul>
            </div>
        );
    }
});

module.exports = Feed;
