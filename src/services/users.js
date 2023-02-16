import { makeRequest } from "./makeRequest";

export function getUsers() {
    return makeRequest(`/profiles/user`)
}

export function getUser(name) {
    return makeRequest(`/profiles/user/${name}`)
}

export function updateAbout(name, { about }) {
    return makeRequest(`/profiles/user/${name}`, {
        method: "PUT",
        data: { about },
    })
}

export function createUser({ name }) {
    return makeRequest(`/profiles/user`, {
        method: "POST",
        data: { name },
    })
}