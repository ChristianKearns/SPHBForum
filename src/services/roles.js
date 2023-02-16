import { makeRequest } from "./makeRequest"

export function getRoles() {
    return makeRequest(`/admin`)
}

export function addRoles({ userId, roleId }) {
    return makeRequest(`/admin`, {
        method: "PUT",
        data: { userId, roleId }
    })
}

export function deleteRole({ roleId }) {
    return makeRequest(`/admin`, {
        method: "DELETE",
        data: { roleId }
    })
}

export function createRole({ name, color }) {
    return makeRequest(`/admin/new-role`, {
        method: "POST",
        data: { name, color }
    })
}