var React = require('react'),
    RSSList = require('./RSSList.jsx'),
    RSSAdder = require('./RSSAdder.jsx');

var RSSListManager = React.createClass({
    render: function () {
        return (
            <div>
                <h1>Your feed</h1>
                <RSSAdder addRSSCallback={this.props.addRSS} urlChangeCallback={this.props.urlChange} />
                <RSSList rssItems={this.props.rssItems} />
            </div>
        );
    }
});

module.exports = React.createFactory(RSSListManager);
