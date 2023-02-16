import { useState } from "react"
import { createPost } from "../services/posts"
import { useAsyncFn } from "../hooks/useAsync"
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useUser } from "../hooks/useUser";

export default function NewPost() {

    const [message, setMessage] = useState("")
    const [title, setTitle] = useState("")
    const navigate = useNavigate()
    const { category } = useParams()
    const createPostFn = useAsyncFn(createPost)
    const currentUser = useUser()
    if (Object.keys(currentUser).length === 0) return <h1>Loading</h1>

    function onPostCreate(category, postTitle, message) {
        return createPostFn.execute(category, { currentUserId: currentUser.id, message, postTitle })
    }

    function handleSubmit(category, e) {
        e.preventDefault()
        onPostCreate(category, title, message)
            .then(() => {
                navigate(`/${category}`)
            })
    }

    return (
        <>
            <h1 className="new-post"> Creating new post! </h1>
            <form onSubmit={(e) => handleSubmit(category, e)}>
                <div className="post-form-row">
                    <div className="new-post-title">Title:</div>
                    <textarea
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        className="title-input"
                    />
                    <br /><br />
                    <div className="new-post-message">Message:</div>
                    <textarea
                        value={message}
                        onChange={e => setMessage(e.target.value)}
                        className="post-input"
                    />
                    <button className="btn" type="submit" disabled={createPostFn.loading}>
                        {createPostFn.loading ? "Loading" : "Post"}
                    </button>
                </div>
                <div className="error-msg">{createPostFn.error}</div>
            </form>
        </>
    )
}