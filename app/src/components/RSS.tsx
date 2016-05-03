/// <reference path="./Feed.tsx" />

module RSS {
    export class RSS extends React.Component<any, any> {
        render () {
            return (
                <li>
                    <div>
                        <Feed.Feed
                            title={this.props.feed.title}
                            url={this.props.feed.url}
                            feedItems={this.props.feed.feedItems}
                        />
                    </div>
                </li>
            );
        }
    }
}
