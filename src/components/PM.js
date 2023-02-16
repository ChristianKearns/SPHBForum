import React from 'react'
import { FaLongArrowAltLeft, FaTrash } from 'react-icons/fa'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useAsync, useAsyncFn } from '../hooks/useAsync'
import { deletePm, getPm } from '../services/pms'
import { IconBtn } from './IconBtn'

export default function PM() {
    const { id } = useParams()
    const navigate = useNavigate()
    const deletePmFn = useAsyncFn(deletePm)
    const { loading, error, value: pm } = useAsync(() => getPm(id), [id])
    if (loading) return <h1>Loading</h1>
    if (error) return <h1 className="error-msg"> {error} </h1>
    const dateFormatter = new Intl.DateTimeFormat(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
    })

    function onPmDelete() {
        return deletePmFn
            .execute(id)
            .then(
                navigate("/profiles/user/pms/inbox")
            )
    }


    return (
        <>
            <Link
                to="/profiles/user/pms/inbox"
                className="nav-arrow-container">
                <IconBtn
                    Icon={FaLongArrowAltLeft}
                    className="navigation-arrow" />
                <div className="postlist-category-name-container">
                    <div className="postlist-category-name">
                        Back to Inbox.
                    </div>
                </div>
            </Link>
            <div className="pm-container">
                <div className="pm-name">{pm.title}</div>
                <span className="post-list-date">from
                    <Link
                        to={`/profiles/user/${pm.from.name}`}
                        className="post-list-user-link"
                        style={{
                            color: `#${pm.from.roles[0].color}`,
                        }}
                    > {pm.from.name}
                    </Link> at {dateFormatter.format(Date.parse(pm.createdAt))}
                </span>
                <div className="pm-message">{pm.message}</div>
                <div className="trs">
                    <IconBtn
                        disabled={deletePmFn.loading}
                        onClick={onPmDelete}
                        Icon={FaTrash}
                        aria-label="Delete"
                        color="danger"
                    />
                </div>
            </div>
        </>
    )
}
