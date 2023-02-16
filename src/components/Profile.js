import { useState } from "react";
import { FaUserEdit } from "react-icons/fa";
import { Link, useParams } from "react-router-dom";
import { useAsync, useAsyncFn } from "../hooks/useAsync";
import { getUser, updateAbout } from "../services/users";
import { IconBtn } from "./IconBtn";

export default function Profile() {
    const { user } = useParams()
    const [liveAbout, setLiveAbout] = useState("")
    const [about, setAbout] = useState("")
    const [showPosts, setShowPosts] = useState(false)
    const [edit, setEdit] = useState(false)
    const [init, setInit] = useState(true)
    const updateAboutFn = useAsyncFn(updateAbout)
    const { loading, error, value: userProfile } = useAsync(() => getUser(user), [user])

    const dateFormatter = new Intl.DateTimeFormat(undefined, {
        dateStyle: "medium",
    })
    if (loading) return <h1>Loading</h1>
    if (error) return <h1 className="error-msg"> {error} </h1>


    function onUserEdit() {
        init && setAbout(userProfile.about)
        init && setLiveAbout(userProfile.about)
        setEdit(!edit)
        setInit(false)
    }


    function onUserUpdate(about) {
        return updateAboutFn
            .execute(userProfile.name, { about })
            .then(userProfile => {
                setEdit(false)
            })
    }

    function handleSubmit(e) {
        e.preventDefault()
        onUserUpdate(about).then(() => {
            setAbout(about)
            setLiveAbout(about)
        })
    }

    return (
        <>
            <IconBtn
                onClick={onUserEdit}
                Icon={FaUserEdit}
                aria-label="Report"
                color="danger" />
            <div className="user-profile-container">
                <div className="user-profile-name">
                    {userProfile.name}

                    <Link to="/profiles/user/pms/inbox" className="new-post-button">
                        Send a Private Message
                    </Link>
                </div>

                {edit ? (
                    <form onSubmit={handleSubmit}>
                        <div className="comment-form-row">
                            <textarea
                                value={about}
                                onChange={e => setAbout(e.target.value)}
                                className="message-input"
                            />
                            <button className="btn" type="submit" disabled={updateAboutFn.loading}>
                                {updateAboutFn.loading ? "Loading" : "Post"}
                            </button>
                        </div>
                        <div className="error-msg">{updateAboutFn.error}</div>
                    </form>
                ) : (
                    init ? (
                        <div className="user-profile-about">{userProfile.about}</div>
                    ) : (
                        <div className="user-profile-about">{liveAbout}</div>
                    )
                )}
                <div className="user-profile-data-container">
                    <div className="titles">
                        Date joined:<br />
                        Reputation:
                    </div>
                    <div className="data">
                        {dateFormatter.format(Date.parse(userProfile.createdAt))}<br />
                        {userProfile._count.likes - userProfile._count.dislikes}
                    </div>
                </div>
                <div className="post-roles">
                    {userProfile.roles.map(role => {
                        return (
                            <h5 className="post-role" key={role.id} style={{ backgroundColor: `#${role.color}` }}>
                                {role.name}
                            </h5>
                        )
                    })}
                </div>
                <div className="user-profile-posts-container">
                    <button
                        onClick={() => setShowPosts(!showPosts)}
                        className="btn">
                        {!showPosts ? "Show Posts" : "Hide Posts"}
                    </button>

                    {showPosts && userProfile.posts.map(post => {
                        return (
                            <div className="post-list-item-container" key={post.id}>
                                <Link to={`/${post.category}/posts/${post.id}`} className="post-link">{post.title}</Link>
                                <span className="post-list-date"> on {dateFormatter.format(Date.parse(post.createdAt))} in {post.category}</span>
                            </div>
                        )
                    })}
                </div>
            </ div>
        </>
    )
}