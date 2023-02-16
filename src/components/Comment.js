import { IconBtn } from "./IconBtn"
import { FaEdit, FaAngleUp, FaAngleDoubleUp, FaAngleDown, FaAngleDoubleDown, FaReply, FaTrash, FaNewspaper } from "react-icons/fa"
import { usePost } from "../contexts/PostContext"
import { CommentList } from "./CommentList"
import { useEffect, useState } from "react"
import { useAsyncFn } from "../hooks/useAsync"
import {
    createComment,
    deleteComment,
    toggleCommentLike,
    toggleCommentDislike,
    updateComment,
} from "../services/comments"
import { CommentForm } from "./CommentForm"
import { useUser } from "../hooks/useUser"
import { Link, useParams } from "react-router-dom"
import AdminNewReport from "./AdminNewReport"

const dateFormatter = new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
})

export function Comment({
    id,
    message,
    user,
    createdAt,
    likeCount,
    dislikeCount,
    upvotedByMe,
    downvotedByMe,
}) {
    const [areChildrenHidden, setAreChildrenHidden] = useState(false)
    const [isReplying, setIsReplying] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [isPos, setIsPos] = useState("black")
    const [isReporting, setIsReporting] = useState(false)
    const {
        post,
        getReplies,
        createLocalComment,
        updateLocalComment,
        deleteLocalComment,
        toggleLocalCommentLike,
        toggleLocalCommentDislike,
    } = usePost()
    const createCommentFn = useAsyncFn(createComment)
    const updateCommentFn = useAsyncFn(updateComment)
    const deleteCommentFn = useAsyncFn(deleteComment)
    const toggleCommentLikeFn = useAsyncFn(toggleCommentLike)
    const toggleCommentDislikeFn = useAsyncFn(toggleCommentDislike)
    const childComments = getReplies(id)
    const currentUser = useUser()
    const { category } = useParams()

    useEffect(() => {
        if ((likeCount - dislikeCount) > 0) {
            setIsPos("rgb(0, 255, 0)")
        }
        else if ((likeCount - dislikeCount) < 0) {
            setIsPos("rgb(255, 0, 0)")
        }
        else {
            setIsPos("black")
        }
    }, [likeCount, dislikeCount])

    function onCommentReply(message) {
        return createCommentFn
            .execute(category, { postId: post.id, message, parentId: id })
            .then(comment => {
                setIsReplying(false)
                createLocalComment(comment)
            })
    }

    function onCommentUpdate(message) {
        return updateCommentFn
            .execute(category, { postId: post.id, message, id })
            .then(comment => {
                setIsEditing(false)
                updateLocalComment(id, comment.message)
            })
    }

    function onCommentDelete() {
        return deleteCommentFn
            .execute(category, { postId: post.id, id })
            .then(comment => deleteLocalComment(comment.id))
    }

    function onToggleCommentLike() {
        return toggleCommentLikeFn
            .execute(category, { id, postId: post.id })
            .then(({ addLike }) => toggleLocalCommentLike(id, addLike))
    }

    function onToggleCommentDislike() {
        return toggleCommentDislikeFn
            .execute(category, { id, postId: post.id })
            .then(({ addDislike }) => toggleLocalCommentDislike(id, addDislike))
    }

    function swapLike() {
        onToggleCommentLike()
        onToggleCommentDislike()
    }

    function onReport() {
        setIsReporting(!isReporting)
    }

    return (
        <>
            <div className="comment">
                <div className="header">
                    <span className="name">
                        <Link
                            to={`/profiles/user/${user.name}`}
                            className="name-link"
                            style={{ color: `#${user.roles[0].color}` }}>{user.name}</Link></span>
                    <span>
                        {dateFormatter.format(Date.parse(createdAt))}
                    </span>
                </div>
                {isEditing ? (
                    <CommentForm
                        autoFocus
                        initialValue={message}
                        onSubmit={onCommentUpdate}
                        loading={updateCommentFn.loading}
                        error={updateCommentFn.error}
                    />
                ) : (
                    <div className="message">{message}</div>
                )}
                <div className="footer">
                    <IconBtn
                        onClick={downvotedByMe ? swapLike : onToggleCommentLike}
                        disabled={toggleCommentLikeFn.loading}
                        Icon={upvotedByMe ? FaAngleDoubleUp : FaAngleUp}
                        aria-label={upvotedByMe ? "Unlike" : "Like"}
                    >
                    </IconBtn>
                    <span className="comment-rep" style={{ color: isPos }}>{likeCount - dislikeCount}</span>
                    <IconBtn
                        onClick={upvotedByMe ? swapLike : onToggleCommentDislike}
                        disabled={toggleCommentDislikeFn.loading}
                        Icon={downvotedByMe ? FaAngleDoubleDown : FaAngleDown}
                        aria-label={downvotedByMe ? "Undislike" : "Dislike"}
                    >
                    </IconBtn>
                    <IconBtn
                        onClick={() => setIsReplying(prev => !prev)}
                        isActive={isReplying}
                        Icon={FaReply}
                        aria-label={isReplying ? "Cancel Reply" : "Reply"}
                    />
                    {((user.id === currentUser.id) || currentUser.admin) && (
                        <>
                            <IconBtn
                                onClick={() => setIsEditing(prev => !prev)}
                                isActive={isEditing}
                                Icon={FaEdit}
                                aria-label={isEditing ? "Cancel Edit" : "Edit"}
                            />
                            <IconBtn
                                disabled={deleteCommentFn.loading}
                                onClick={onCommentDelete}
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
                {deleteCommentFn.error && (
                    <div className="error-msg mt-1">{deleteCommentFn.error}</div>
                )}
            </div>
            {
                (isReporting) && (
                    <AdminNewReport commentId={id} isPost={false} />
                )
            }
            {
                isReplying && (
                    <div className="mt-1 ml-3">
                        <CommentForm
                            autoFocus
                            onSubmit={onCommentReply}
                            loading={createCommentFn.loading}
                            error={createCommentFn.error}
                        />
                    </div>
                )
            }
            {
                childComments?.length > 0 && (
                    <>
                        <div
                            className={`nested-comments-stack ${areChildrenHidden ? "hide" : ""
                                }`}
                        >
                            <button
                                className="collapse-line"
                                aria-label="Hide Replies"
                                onClick={() => setAreChildrenHidden(true)}
                            />
                            <div className="nested-comments">
                                <CommentList comments={childComments} />
                            </div>
                        </div>
                        <button
                            className={`btn mt-1 ${!areChildrenHidden ? "hide" : ""}`}
                            onClick={() => setAreChildrenHidden(false)}
                        >
                            Show Replies
                        </button>
                    </>
                )
            }
        </>
    )
}