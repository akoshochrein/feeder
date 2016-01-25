var React = require('react');

var FeedItem = React.createClass({
    render: function () {
        return (
            <li>
                <a target="_blank" href={this.props.feedItem.url}><h4>{this.props.feedItem.title}</h4></a>
            </li>
        );
    }
});

module.exports = FeedItem;
