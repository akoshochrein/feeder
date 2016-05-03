
var RSSAdder = React.createClass({
    handleAddRSS: function (e) {
        e.preventDefault();

        var input = this.refs.urlInput,
            url = input.value;

        this.props.addRSSCallback(url);
        input.value = "";
    },

    render: function () {
        return (
            <div>
                <input ref="urlInput" type="text" />
                <button onClick={this.handleAddRSS}>Add</button>
            </div>
        );
    }
});

module.exports = RSSAdder;
