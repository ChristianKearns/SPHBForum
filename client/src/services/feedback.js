import { makeRequest } from "./makeRequest";

export function getFeedback() {
    return makeRequest(`/admin/feedback`)
}

export function createFeedback({ feedback }) {
    return makeRequest(`/admin/create-feedback`, {
        method: "POST",
        data: { feedback },
    })
}

export function deleteFeedback(id) {
    return makeRequest(`/admin/feedback/${id}`, {
        method: "DELETE",
    })
}