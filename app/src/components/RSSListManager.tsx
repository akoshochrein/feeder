// var RSSAdder = require('./RSSAdder.jsx');
/// <reference path="./RSSList.tsx" />


// import { RSSList } from "./RSSList";

// <RSSAdder addRSSCallback={this.props.addRSS} />
// <RSSList rssItems={this.props.rssItems} />

module RSSListManager {
    export class RSSListManager extends React.Component<any, any> {
        render() {
            return (
                <div>
                    <h1>Your feed</h1>
                    <RSSList.RSSList rssItems={this.props.rssItems} />
                </div>
            );
        }
    }
}
