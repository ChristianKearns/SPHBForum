import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAsyncFn } from '../hooks/useAsync'
import { createFeedback } from '../services/feedback'

export default function AdminNewFeedback() {

    const [message, setMessage] = useState("")
    const createFeedbackFn = useAsyncFn(createFeedback)
    const navigate = useNavigate()

    function onFeedbackCreate(message) {
        return createFeedbackFn.execute({ message })
    }

    function handleSubmit(e) {
        e.preventDefault()
        onFeedbackCreate(message)
            .then(() => {
                navigate(`/admin`)
            })
    }

    return (
        <form onSubmit={(e) => handleSubmit(e)}>
            <div className="post-form-row">
                <div className="new-post-message">Message:</div>
                <textarea
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    className="post-input"
                />
                <button className="btn" type="submit" disabled={createFeedbackFn.loading}>
                    {createFeedbackFn.loading ? "Loading" : "Post"}
                </button>
            </div>
            <div className="error-msg">{createFeedbackFn.error}</div>
        </form>
    )
}
