var React = require('react'),
    Feed = require('./Feed.jsx');

var RSS = React.createClass({
    render: function () {
        return (
            <li>
                <div>
                    <Feed
                        title={this.props.feed.title}
                        url={this.props.feed.url}
                        feedItems={this.props.feed.feedItems}
                    />
                </div>
            </li>
        );
    }
});

module.exports = RSS;
