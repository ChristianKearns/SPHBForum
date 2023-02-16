import { Link } from "react-router-dom"
import { useAsync } from "../hooks/useAsync"
import { getPosts } from "../services/posts"
import { useParams } from "react-router-dom"

export function PostList() {
    const { category } = useParams()
    const { loading, error, value: posts } = useAsync(() => getPosts(category), [category])
    if (loading) return <h1>Loading</h1>
    if (error) return <h1 className="error-msg"> {error} </h1>
    const dateFormatter = new Intl.DateTimeFormat(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
    })

    return (
        <>
            <div className="post-list-container">
                {posts.map(post => {
                    return (
                        <div className="post-list-item-container" key={post.id}>
                            {/* Post Title */}
                            <Link
                                to={`/${category}/posts/${post.id}`}
                                className="post-link">
                                {post.title}
                            </Link>

                            {/* on Date */}
                            <span className="post-list-date"> at {dateFormatter.format(Date.parse(post.createdAt))}</span>

                            {/* Post User */}
                            <div className="post-list-user">
                                by:   <Link
                                    to={`/profiles/user/${post.user.name}`}
                                    className="post-list-user-link"
                                    style={{
                                        color: `#${post.user.roles[0].color}`,
                                    }}>
                                    {post.user.name}
                                </Link>
                            </div>



                        </div>
                    )
                })}
            </div>
        </>
    )
}