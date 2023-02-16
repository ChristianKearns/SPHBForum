import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAsyncFn } from '../hooks/useAsync'
import { createRole } from '../services/roles'

export default function Admin_NewRole() {
    const [role, setRole] = useState("")
    const [color, setColor] = useState("")
    const navigate = useNavigate()
    const createRoleFn = useAsyncFn(createRole)

    function onRoleCreate(name, color) {
        return createRoleFn.execute({ name, color })
    }

    function handleSubmit(e) {
        e.preventDefault()
        onRoleCreate(role, color)
            .then(() => {
                navigate(`/admin`)
            })
    }

    return (
        <form onSubmit={(e) => handleSubmit(e)}>
            <div className="post-form-row">
                <div className="new-post-title">Color (in HEX):</div>
                <textarea
                    value={color}
                    onChange={e => setColor(e.target.value)}
                    className="title-input"
                />
                <br /><br />
                <div className="new-post-message">Role Name:</div>
                <textarea
                    value={role}
                    onChange={e => setRole(e.target.value)}
                    className="post-input"
                />
                <button className="btn" type="submit" disabled={createRoleFn.loading}>
                    {createRoleFn.loading ? "Loading" : "Post"}
                </button>
            </div>
            <div className="error-msg">{createRoleFn.error}</div>
        </form>
    )
}
