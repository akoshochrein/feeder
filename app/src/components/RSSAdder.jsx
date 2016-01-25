var React = require('react');

var RSSAdder = React.createClass({
    render: function () {
        return (
            <div>
                <input type="text" onChange={this.props.urlChangeCallback} />
                <button onClick={this.props.addRSSCallback}>Add</button>
            </div>
        );
    }
});

module.exports = RSSAdder;
