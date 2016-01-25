var React = require('react');

var FeedItem = React.createClass({
    render: function () {
        return (
            <li>
                <h3>{this.props.feedItem.title}</h3>
            </li>
        );
    }
});

module.exports = FeedItem;
