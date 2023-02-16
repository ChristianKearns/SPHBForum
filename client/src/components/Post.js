import { usePost } from "../contexts/PostContext"
import { CommentList } from "./CommentList"
import { CommentForm } from "./CommentForm"
import { useAsyncFn } from "../hooks/useAsync"
import { createComment } from "../services/comments"
import { Link, useNavigate, useParams } from "react-router-dom"
import { FaAngleDoubleDown, FaAngleDoubleUp, FaAngleDown, FaAngleUp, FaEdit, FaLongArrowAltLeft, FaNewspaper, FaTrash } from "react-icons/fa"
import { deletePost, togglePostDislike, togglePostLike, updatePost } from "../services/posts"
import { useEffect, useState } from "react"
import { IconBtn } from "./IconBtn"
import { useUser } from "../hooks/useUser"
import AdminNewReport from "./AdminNewReport"

export function Post() {
    const [isEditing, setIsEditing] = useState(false)
    const [isReporting, setIsReporting] = useState(false)
    const [isPos, setIsPos] = useState("black")
    const [isPos2, setIsPos2] = useState("black")
    const { post, rootComments, createLocalComment, updateLocalPost, toggleLocalPostLike, toggleLocalPostDislike } = usePost()
    const { loading, error, execute: createCommentFn } = useAsyncFn(createComment)
    const { category } = useParams()
    const [livePost, setLivePost] = useState(post.body)
    const [liveLikes, setLiveLikes] = useState(post)
    const currentUser = useUser()
    const updatePostFn = useAsyncFn(updatePost)
    const deletePostFn = useAsyncFn(deletePost)
    const togglePostLikeFn = useAsyncFn(togglePostLike)
    const togglePostDislikeFn = useAsyncFn(togglePostDislike)
    const navigate = useNavigate()
    const dateFormatter = new Intl.DateTimeFormat(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
    })
    const userRep = post.user.likes.length - post.user.dislikes.length

    useEffect(() => {
        if (userRep > 0) {
            setIsPos("rgb(0, 255, 0)")
        }
        else if (userRep < 0) {
            setIsPos("rgb(255, 0, 0)")
        }
    }, [userRep])

    useEffect(() => {
        if ((liveLikes.numLikes - liveLikes.numDislikes) > 0) {
            setIsPos2("rgb(0, 255, 0)")
        }
        else if ((liveLikes.numLikes - liveLikes.numDislikes) < 0) {
            setIsPos2("rgb(255, 0, 0)")
        }
        else {
            setIsPos2("black")
        }
    }, [liveLikes.numLikes, liveLikes.numDislikes])

    if (Object.keys(currentUser).length === 0) return <h1> Loading </h1>


    function onCommentcreate(message) {
        return createCommentFn(category, { postId: post.id, message })
            .then(
                createLocalComment
            )
    }

    function onPostUpdate(message) {
        return updatePostFn
            .execute(category, post.id, { currentUserId: currentUser.id, message })
            .then(post => {
                setIsEditing(false)
                setLivePost(updateLocalPost(post.body))
            }
            )
    }

    function onPostDelete() {
        return deletePostFn
            .execute(category, post.id, { currentUserId: currentUser.id })
            .then(() => {
                navigate(`/${category}`)
            })
    }

    function onTogglePostLike() {
        return togglePostLikeFn
            .execute(category, post.id)
            .then(({ addLike }) => {
                setLiveLikes(toggleLocalPostLike(post.id, addLike))
            })
    }

    function onTogglePostDislike() {
        return togglePostDislikeFn
            .execute(category, post.id)
            .then(({ addDislike }) => {
                setLiveLikes(toggleLocalPostDislike(post.id, addDislike))
            })
    }

    function swapLike() {
        onTogglePostLike()
        onTogglePostDislike()
    }

    function onReport() {
        setIsReporting(!isReporting)
    }

    return (
        <>
            <Link to={`/${post.category}`} className="nav-arrow-container">
                <IconBtn
                    Icon={FaLongArrowAltLeft}
                    className="navigation-arrow" />
                <div className="postlist-category-name-container">
                    <div className="postlist-category-name">
                        {post.category}
                    </div>
                </div>
            </Link>
            <div className="post-container">
                {/* Name, Date */}
                <div className="post-user-container">
                    <div className="post-name">
                        <Link
                            to={`/profiles/user/${post.user.name}`}
                            className="name-link"
                            style={{ color: `#${post.user.roles[0].color}` }}>
                            {post.user.name}
                        </Link>
                    </div>
                    {/* User Reputation */}
                    <div className="post-rep">
                        Reputation: <span style={{ color: isPos }}>{userRep}</span>
                        <br />Roles:
                    </div>

                    {/* Roles */}
                    <div className="post-roles">
                        {post.user.roles.map(role => {
                            return (
                                <div
                                    key={role.id}
                                    className="post-role"
                                    style={{ backgroundColor: `#${role.color}` }}>
                                    {role.name}
                                </div>
                            )
                        })}
                    </div>
                </div>
                <div className="post-content">
                    {/* Title */}
                    <div className="post-title-container">
                        <span className="post-title">{post.title}</span>
                    </div>
                    {/* Date */}
                    <div className="date-container">
                        {dateFormatter.format(Date.parse(post.createdAt))}
                    </div>
                    {/* Message Body */}
                    <div className="post-message-container">
                        {isEditing ? (
                            <CommentForm
                                autoFocus
                                initialValue={post.body}
                                onSubmit={onPostUpdate}
                                loading={updatePostFn.loading}
                                error={updatePostFn.error}
                            />
                        ) : (
                            <div className="message">{livePost}</div>
                        )}
                    </div>
                    {/* Post Tools */}
                    <div className="post-tools-container">
                        <IconBtn
                            onClick={liveLikes.downvoted ? swapLike : onTogglePostLike}
                            disabled={togglePostLikeFn.loading}
                            Icon={liveLikes.upvoted ? FaAngleDoubleUp : FaAngleUp}
                            aria-label={liveLikes.upvoted ? "Unlike" : "Like"}
                        />
                        <span className="comment-rep" style={{ color: isPos2 }}>{liveLikes.numLikes - liveLikes.numDislikes}</span>
                        <IconBtn
                            onClick={liveLikes.upvoted ? swapLike : onTogglePostDislike}
                            disabled={togglePostDislikeFn.loading}
                            Icon={liveLikes.downvoted ? FaAngleDoubleDown : FaAngleDown}
                            aria-label={liveLikes.downvoted ? "Unlike" : "Like"}
                        />
                        {(currentUser.id === post.userId) && (
                            <>
                                <IconBtn
                                    onClick={() => setIsEditing(prev => !prev)}
                                    isActive={isEditing}
                                    Icon={FaEdit}
                                    aria-label={isEditing ? "Cancel Edit" : "Edit"}
                                />
                                <IconBtn
                                    disabled={deletePostFn.loading}
                                    onClick={onPostDelete}
                                    Icon={FaTrash}
                                    aria-label="Delete"
                                    color="danger"
                                />

                            </>
                        )}
                        <IconBtn
                            onClick={onReport}
                            Icon={FaNewspaper}
                            aria-label="Report"
                            color="danger"
                        />
                    </div>
                </div>
            </div>
            {
                (isReporting) && (
                    <AdminNewReport postId={post.id} isPost={true} />
                )
            }
            {/* Comment Section */}
            <h3 className="comments-title">Comments</h3>
            <section>
                {rootComments != null && rootComments.length > 0 && (
                    <div className="mt-4">
                        <CommentList comments={rootComments} />
                    </div>
                )}
                <br />
                <CommentForm
                    loading={loading}
                    error={error}
                    onSubmit={onCommentcreate} />
            </section>
        </>
    )
}