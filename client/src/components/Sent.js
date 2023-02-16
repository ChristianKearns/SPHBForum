import React from 'react'
import { Link } from 'react-router-dom'
import { useAsync } from '../hooks/useAsync'
import { getSent } from '../services/pms'

export default function Sent() {
    const { loading, error, value: user } = useAsync(getSent)
    if (loading) return <h1>Loading</h1>
    if (error) return <h1 className="error-msg"> {error} </h1>
    const dateFormatter = new Intl.DateTimeFormat(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
    })

    return (
        <>
            <div className='pm-btn-container'>
                <Link to="/profiles/user/pms/inbox" className="new-post-button">Inbox</Link>
                <Link to="/profiles/user/pms/new-pm" className="new-post-button">Send PM.</Link>
            </div>
            <div className="post-list-container">
                {user.sent.map(pm => {
                    return (
                        <div className="post-list-item-container" key={pm.id}>
                            {/* User Name */ console.log(pm)}
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
                                To:   <Link
                                    to={`/profiles/user/${pm.to.name}`}
                                    className="post-list-user-link"
                                    style={{
                                        color: `#${pm.to.roles[0].color}`,
                                    }}>
                                    {pm.to.name}
                                </Link>
                            </div>
                        </div>
                    )
                    // return (
                    //     <h5 className="post-styling" key={pm.id}>
                    //         <Link to={`/profiles/user/pms/sent/${pm.id}`} className="post-link">{pm.title}</Link>
                    //     </h5>
                    // )
                })}
            </div>
        </>
    )
}
