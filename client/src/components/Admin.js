import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAsync, useAsyncFn } from '../hooks/useAsync'
import { addRoles, deleteRole, getRoles } from '../services/roles'
import { getUsers } from '../services/users'
import { deleteReport, getCommentReports, getReports } from '../services/reports'
import { deleteFeedback, getFeedback } from '../services/feedback'
import { FaTrash } from 'react-icons/fa'
import { IconBtn } from './IconBtn'
import Notification from './Notification'

export default function Admin() {
    const [notification, setNotification] = useState(false)
    const [theUser, setTheUser] = useState("")
    const [role, setRole] = useState("")
    const addRolesFn = useAsyncFn(addRoles)
    const deleteRolesFn = useAsyncFn(deleteRole)
    const deleteReportFn = useAsyncFn(deleteReport)
    const deleteFeedbackFn = useAsyncFn(deleteFeedback)
    const { value: users } = useAsync(getUsers)
    const { value: reports } = useAsync(getReports)
    const { value: commentReports } = useAsync(getCommentReports)
    const { value: feedback } = useAsync(getFeedback)
    const { loading, error, value: roles } = useAsync(getRoles)
    if (loading) return <h1>Loading</h1>
    if (error) return <h1 className="error-msg"> {error} </h1>
    const dateFormatter = new Intl.DateTimeFormat(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
    })

    function onRoleDelete(roleId) {
        return deleteRolesFn.execute({ roleId })
            .then(window.location.reload(false))
    }

    function onRoleAdd(userId, roleId) {
        return addRolesFn.execute({ userId, roleId })
            .then(setNotification(true))
    }

    function onReportDelete(id) {
        return deleteReportFn.execute(id)
            .then(window.location.reload(false))
    }

    function onFeedbackDelete(id) {
        return deleteFeedbackFn.execute(id)
            .then(window.location.reload(false))
    }

    function handleSubmit(e) {
        e.preventDefault()
        onRoleAdd(theUser, role)
    }

    return (
        <>
            {notification && <Notification message="hey" display={notification} />}
            <Link to={`/admin/new-role`} className="new-post-button">Create new role!</Link>
            <h3>Add Roles to Users</h3>
            <form className="admin-role-form"
                onSubmit={(e) => handleSubmit(e)}>
                <select
                    value={theUser}
                    onChange={e => setTheUser(e.target.value)}
                    className="title-input">
                    <option>Select a user</option>
                    {
                        users.map(user => {
                            return <option key={user.id} value={user.id}>{user.name}</option>
                        })
                    }
                </ select>
                <button className="btn" type="submit">
                    Submit
                </button>
                <select
                    value={role}
                    onChange={e => setRole(e.target.value)}
                    className="title-input">
                    <option>Select a role</option>
                    {
                        roles.map(role => {
                            return <option key={role.id} value={role.id}>{role.name}</option>
                        })
                    }
                </ select>
            </form>
            <h3>Role List</h3>
            <div>
                {
                    roles.map(role => {
                        return (
                            <>
                                <h5 key={role.id}>{role.name}</h5>
                                <IconBtn
                                    disabled={deleteReportFn.loading}
                                    onClick={() => onRoleDelete(role.id)}
                                    Icon={FaTrash}
                                    aria-label="Delete"
                                    color="danger"
                                />
                            </>
                        )
                    })
                }
            </div>
            <h3>Reported Posts</h3>
            <div className="post-list-container">
                {
                    reports.map(report => {
                        return (
                            <div className="post-list-item-container">
                                <div className="admin-reported-by" key={report.id}>
                                    <IconBtn
                                        disabled={deleteReportFn.loading}
                                        onClick={() => onReportDelete(report.id)}
                                        Icon={FaTrash}
                                        aria-label="Delete"
                                        color="danger"
                                    />
                                    <b>Reported by:</b> {report.reporter.name}</div>
                                <div className="post-list-date">{dateFormatter.format(Date.parse(report.createdAt))}</div>
                                <div className='admin-report-reason'><b>Reason:</b> {report.reason}</div>

                                <div className="post-user-container">
                                    <div className="post-name" key={report.id}>
                                        <Link
                                            to={`/profiles/user/${report.reportedPost.user.name}`}
                                            className="name-link"
                                            style={{ color: "black" }}

                                        >
                                            {report.reportedPost.user.name}
                                        </Link>
                                    </div>
                                </div>
                                <div className="post-content">
                                    {/* Title */}
                                    <div className="post-title-container">
                                        <span className="post-title" key={report.id}>{report.reportedPost.title}</span>
                                    </div>
                                    {/* Date */}
                                    <div className="date-container" key={report.id}>
                                        {dateFormatter.format(Date.parse(report.reportedPost.createdAt))}
                                    </div>
                                    {/* Message Body */}
                                    <div className="post-message-container">

                                        <div className="message" key={report.id}>{report.reportedPost.body}</div>
                                    </div>


                                </div>
                            </div>
                        )
                    })
                }
            </div>

            <h3>Reported Comments</h3>
            <div className="post-list-container">
                {
                    commentReports.map(report => {
                        return (
                            <div className="post-list-item-container">
                                <div className="admin-reported-by" key={report.id}>
                                    <IconBtn
                                        disabled={deleteReportFn.loading}
                                        onClick={() => onReportDelete(report.id)}
                                        Icon={FaTrash}
                                        aria-label="Delete"
                                        color="danger"
                                    />
                                    <b>Reported by:</b> {report.reporter.name}</div>
                                <div className="post-list-date">{dateFormatter.format(Date.parse(report.createdAt))}</div>
                                <div className='admin-report-reason'><b>Reason:</b> {report.reason}</div>

                                <div className="post-user-container">
                                    <div className="post-name" key={report.id}>
                                        <Link
                                            to={`/profiles/user/${report.reportedComment.user.name}`}
                                            className="name-link"
                                            style={{ color: "black" }}

                                        >
                                            {report.reportedComment.user.name}
                                        </Link>
                                    </div>
                                </div>
                                <div className="post-content">
                                    {/* Date */}
                                    <div className="date-container" key={report.id}>
                                        {dateFormatter.format(Date.parse(report.reportedComment.createdAt))}
                                    </div>
                                    {/* Message Body */}
                                    <div className="post-message-container">

                                        <div className="message" key={report.id}>{report.reportedComment.message}</div>
                                    </div>


                                </div>
                            </div>
                        )
                    })
                }
            </div>

            <h3>Feedback</h3>
            <div className="post-list-container">
                {
                    feedback.map(fb => {
                        return (
                            <div className="post-list-item-container" key={fb.id}>
                                <IconBtn
                                    disabled={deleteFeedbackFn.loading}
                                    onClick={() => onFeedbackDelete(fb.id)}
                                    Icon={FaTrash}
                                    aria-label="Delete"
                                    color="danger"
                                />
                                <div className="post-list-date">{dateFormatter.format(Date.parse(fb.createdAt))}</div>
                                <div>{fb.feedback}</div>
                            </div>
                        )
                    })
                }
            </div>
        </>
    )
}
