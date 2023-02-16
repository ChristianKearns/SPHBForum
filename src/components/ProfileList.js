import { Link } from "react-router-dom";
import { useAsync } from "../hooks/useAsync";
import { getUsers } from "../services/users";

export default function Profile() {
    const { loading, error, value: users } = useAsync(getUsers)
    if (loading) return <h1>Loading</h1>
    if (error) return <h1 className="error-msg"> {error} </h1>
    const dateFormatter = new Intl.DateTimeFormat(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
    })


    return (
        <>
            <h1>List of Profiles</h1>
            {users.map(user => {
                return (
                    <div className="post-list-item-container" key={user.id}>
                        {/* User Name */}
                        <span><Link
                            to={`/profiles/user/${user.name}`}
                            className="post-link">
                            {user.name}
                        </Link>{user.admin ? (<span className="admin">{user.admin ? "ADMIN" : ""}</span>) : ""}</span>

                        {/* on Date */}
                        <span className="post-list-date"> at {dateFormatter.format(Date.parse(user.createdAt))}</span>
                    </div>
                )
            })}
        </>
    )
}