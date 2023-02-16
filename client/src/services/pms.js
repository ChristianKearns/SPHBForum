import { makeRequest } from "./makeRequest";

export function getInbox() {
    return makeRequest(`/profiles/user/pms/inbox`)
}

export function getSent() {
    return makeRequest(`/profiles/user/pms/sent`)
}

export function getPm(id) {
    return makeRequest(`/profiles/user/pms/inbox/${id}`)
}

export function createPm({ to, title, message }) {
    return makeRequest(`/profiles/user/pms/new-pm`, {
        method: "POST",
        data: { to, title, message }
    })
}

export function deletePm(id) {
    return makeRequest(`/profiles/user/pms/inbox/${id}`, {
        method: "DELETE",
    })
}