/// <reference path="./RSS.tsx" />

module RSSList {
    export class RSSList extends React.Component<any, any> {
        createRSS (feed, index) {
            return <RSS.RSS feed={feed} key={feed.title + index} />
        }

        render () {
            return (
                <div>
                    <ul>{this.props.rssItems.map(this.createRSS.bind(this))}</ul>
                </div>
            );
        }
    };
}
