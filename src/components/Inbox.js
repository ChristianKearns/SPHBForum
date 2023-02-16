import React from 'react'
import { Link } from 'react-router-dom'
import { useAsync } from '../hooks/useAsync'
import { getInbox } from '../services/pms'

export default function Inbox() {
    const { loading, error, value: user } = useAsync(getInbox)
    if (loading) return <h1>Loading</h1>
    if (error) return <h1 className="error-msg"> {error} </h1>
    const dateFormatter = new Intl.DateTimeFormat(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
    })

    return (
        <>
            <div className='pm-btn-container'>
                <Link to="/profiles/user/pms/sent" className="new-post-button">Sent</Link>
                <Link to="/profiles/user/pms/new-pm" className="new-post-button">Send PM.</Link>
            </div>
            <div className="post-list-container">
                {user.inbox.map(pm => {
                    return (
                        <div className="post-list-item-container" key={pm.id}>
                            {/* User Name */}
                            <span>
                                <Link
                                    to={`/profiles/user/pms/inbox/${pm.id}`}
                                    className="post-link">
                                    {pm.title}
                                </Link>
                            </span>

                            {/* on Date */}
                            <span className="post-list-date"> at {dateFormatter.format(Date.parse(pm.createdAt))}</span>

                            <div className="post-list-user">
                                From:   <Link
                                    to={`/profiles/user/${pm.from.name}`}
                                    className="post-list-user-link"
                                    style={{
                                        color: `#${pm.from.roles[0].color}`,
                                    }}>
                                    {pm.from.name}
                                </Link>
                            </div>
                        </div>
                    )
                })}
            </div>
        </>
    )
}
