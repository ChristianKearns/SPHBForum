import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAsyncFn } from '../hooks/useAsync'
import { createCommentReport, createReport } from '../services/reports'

export default function AdminNewReport({ postId, commentId, isPost }) {
    const [reason, setReason] = useState("")
    const createReportFn = useAsyncFn(createReport)
    const createCommentReportFn = useAsyncFn(createCommentReport)
    const navigate = useNavigate()

    function onReportCreate(postId, reason, isPost) {
        return createReportFn.execute({ postId, reason, isPost })
    }

    function onReportCommentCreate(commentId, reason, isPost) {
        return createCommentReportFn.execute({ commentId, reason, isPost })
    }

    function handleSubmit(e) {
        e.preventDefault()
        if (isPost) {
            onReportCreate(postId, reason, isPost)
                .then(() => {
                    navigate(`/`)
                })
        }
        else {
            onReportCommentCreate(commentId, reason, isPost)
                .then(() => {
                    navigate(`/`)
                })
        }
    }

    return (
        <form onSubmit={(e) => handleSubmit(e)}>
            <div className="post-form-row">
                <div className="new-post-message">Reason:</div>
                <textarea
                    value={reason}
                    onChange={e => setReason(e.target.value)}
                    className="post-input"
                />
                <button className="btn" type="submit" disabled={createReportFn.loading}>
                    {createReportFn.loading ? "Loading" : "Post"}
                </button>
            </div>
            <div className="error-msg">{createReportFn.error}</div>
        </form>
    )
}
