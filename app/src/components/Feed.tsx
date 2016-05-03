/// <reference path="./FeedItem.tsx" />

module Feed {
    export class Feed extends React.Component<any, any> {
        createFeedItem (feedItem: any, index: any) {
            return <FeedItem.FeedItem key={index + feedItem.title} feedItem={feedItem} />;
        }

        render () {
            return (
                <div>
                    <h2>{this.props.title}</h2>
                    <h3>{this.props.url}</h3>
                    <ul>
                        {this.props.feedItems.map(this.createFeedItem.bind(this))}
                    </ul>
                </div>
            );
        }
    }
}
