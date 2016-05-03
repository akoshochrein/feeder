
module FeedItem {
    export class FeedItem extends React.Component<any, any> {
        render () {
            return (
                <li>
                    <a target="_blank" href={this.props.feedItem.url}><h4>{this.props.feedItem.title}</h4></a>
                </li>
            );
        }
    }
}
