import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAsync, useAsyncFn } from "../hooks/useAsync"
import { createPm } from "../services/pms"
import { getUsers } from "../services/users"

export default function NewPMForm() {
    const [message, setMessage] = useState("")
    const [title, setTitle] = useState("")
    const [to, setTo] = useState("")
    const navigate = useNavigate()
    const createPmFn = useAsyncFn(createPm)
    const { loading, error, value: users } = useAsync(getUsers)
    if (loading) return <h1>Loading</h1>
    if (error) return <h1 className="error-msg"> {error} </h1>

    function onPmCreate(to, title, message) {
        return createPmFn.execute({ to, title, message })
    }

    function handleSubmit(e) {
        e.preventDefault()
        onPmCreate(to, title, message)
            .then(() => {
                navigate(`/profiles/user/pms/inbox`)
            })
    }

    return (
        <div>
            <h1 className="new-post"> Creating new private message! </h1>
            <form onSubmit={(e) => handleSubmit(e)}>
                <div className="post-form-row">
                    <div className="new-post-title">To:</div>

                    <select
                        value={to}
                        onChange={e => setTo(e.target.value)}
                        className="title-input">
                        <option>Select a recipient</option>
                        {
                            users.map(user => {
                                return <option key={user.id} value={user.id}>{user.name}</option>
                            })
                        }
                    </ select>

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
                    <button className="btn" type="submit" disabled={createPmFn.loading}>
                        {createPmFn.loading ? "Loading" : "Post"}
                    </button>
                </div>
                <div className="error-msg">{createPmFn.error}</div>
            </form>
        </div>
    )
}