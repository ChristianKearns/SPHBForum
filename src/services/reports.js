import { makeRequest } from "./makeRequest";

export function getReports() {
    return makeRequest(`/admin/reports`)
}

export function getCommentReports() {
    return makeRequest(`/admin/comment-reports`)
}

export function getReport(id) {
    return makeRequest(`/admin/reports/${id}`)
}

export function createReport({ postId, reason, isPost }) {
    return makeRequest(`/admin/create-report`, {
        method: "POST",
        data: { postId, reason, isPost },
    })
}

export function createCommentReport({ commentId, reason, isPost }) {
    return makeRequest(`/admin/create-comment-report`, {
        method: "POST",
        data: { commentId, reason, isPost },
    })
}

export function deleteReport(id) {
    return makeRequest(`/admin/reports/${id}`, {
        method: "DELETE",
    })
}