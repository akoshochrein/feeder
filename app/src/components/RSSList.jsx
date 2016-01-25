var React = require('react'),
    RSS = require('./RSS.jsx'),
    Feed = require('./Feed.jsx');

var RSSList = React.createClass({
    createRSS: function (feed, index) {
        return <RSS feed={feed} index={feed.title + index} />
    },

    render: function () {
        return (
            <div>
                <ul>{this.props.rssItems.map(this.createRSS)}</ul>
            </div>
        );
    }
});

module.exports = RSSList;
