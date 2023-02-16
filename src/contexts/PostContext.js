import React, { useContext, useEffect, useMemo, useState } from "react"
import { useParams } from "react-router-dom"
import { useAsync, useAsyncFn } from "../hooks/useAsync"
import { useUser } from "../hooks/useUser"
import { getPost } from "../services/posts"

const Context = React.createContext()

export function usePost() {
    return useContext(Context)
}

export function PostProvider({ children }) {
    const { id } = useParams()
    const { category } = useParams()
    const currentUser = useUser()
    const getPostFn = useAsyncFn(getPost)
    // const { loading, error, value: post } = useAsync(() => getPost(category, id), [category, id])
    const [comments, setComments] = useState([])
    const commentsByParentId = useMemo(() => {
        const group = {}
        comments.forEach(comment => {
            group[comment.parentId] ||= []
            group[comment.parentId].push(comment)
        })
        return group
    }, [comments])

    useEffect(() => {
        if (post?.comments == null) return
        setComments(post.comments)
    }, [post?.comments])

    function getPostFunc(category, id, currentUser) {
        return getPostFn
            .execute(category, id, { currentUserId: currentUser.id })
    }

    function getReplies(parentId) {
        return commentsByParentId[parentId]
    }

    function updateLocalPost(message) {
        return message
    }

    function toggleLocalPostLike(id, addLike) {
        if (addLike) {
            post.numLikes = post.numLikes + 1
            post.upvoted = true
        }
        else {
            post.numLikes = post.numLikes - 1
            post.upvoted = false
        }
        return post
    }

    function toggleLocalPostDislike(id, addDislike) {
        if (addDislike) {
            post.numDislikes = post.numDislikes + 1
            post.downvoted = true
        }
        else {
            post.numDislikes = post.numDislikes - 1
            post.downvoted = false
        }
        return post
    }

    function createLocalComment(comment) {
        setComments(prevComments => {
            return [comment, ...prevComments]
        })
    }

    function updateLocalComment(id, message) {
        setComments(prevComments => {
            return prevComments.map(comment => {
                if (comment.id === id) {
                    return { ...comment, message }
                } else {
                    return comment
                }
            })
        })
    }

    function deleteLocalComment(id) {
        setComments(prevComments => {
            return prevComments.filter(comment => comment.id !== id)
        })
    }

    function toggleLocalCommentLike(id, addLike) {
        setComments(prevComments => {
            return prevComments.map(comment => {
                if (id === comment.id) {
                    if (addLike) {
                        return {
                            ...comment,
                            likeCount: comment.likeCount + 1,
                            upvotedByMe: true,
                        }
                    } else {
                        return {
                            ...comment,
                            likeCount: comment.likeCount - 1,
                            upvotedByMe: false,
                        }
                    }
                } else {
                    return comment
                }
            })
        })
    }

    function toggleLocalCommentDislike(id, addDislike) {
        setComments(prevComments => {
            return prevComments.map(comment => {
                if (id === comment.id) {
                    if (addDislike) {
                        return {
                            ...comment,
                            dislikeCount: comment.dislikeCount + 1,
                            downvotedByMe: true,
                        }
                    } else {
                        return {
                            ...comment,
                            dislikeCount: comment.dislikeCount - 1,
                            downvotedByMe: false,
                        }
                    }
                } else {
                    return comment
                }
            })
        })
    }

    if (Object.keys(currentUser).length === 0) return <h1> Loading </h1>
    const { loading, error, value: post } = getPostFunc(category, id, currentUser)

    return (
        <Context.Provider
            value={{
                post: { id, ...post },
                rootComments: commentsByParentId[null],
                getReplies,
                updateLocalPost,
                createLocalComment,
                updateLocalComment,
                deleteLocalComment,
                toggleLocalCommentLike,
                toggleLocalCommentDislike,
                toggleLocalPostLike,
                toggleLocalPostDislike,
            }}
        >
            {loading ? (
                <h1>Loading</h1>
            ) : error ? (
                <h1 className="error-msg">{error}</h1>
            ) : (
                children
            )}
        </Context.Provider>
    )
}