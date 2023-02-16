import { makeRequest } from "./makeRequest";

export function login({ id, name }) {
    return makeRequest(`/login`, {
        method: "POST",
        data: { id, name },
    })
}