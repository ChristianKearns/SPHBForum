import { makeRequest } from "./makeRequest";

export function createComment(category, { postId, parentId, message }) {
    return makeRequest(`/${category}/posts/${postId}/comments`, {
        method: "POST",
        data: { message, parentId },
    })
}

export function updateComment(category, { postId, message, id }) {
    return makeRequest(`/${category}/posts/${postId}/comments/${id}`, {
        method: "PUT",
        data: { message },
    })
}

export function deleteComment(category, { postId, id }) {
    return makeRequest(`/${category}/posts/${postId}/comments/${id}`, {
        method: "DELETE",
    })
}

export function toggleCommentLike(category, { id, postId }) {
    return makeRequest(`/${category}/posts/${postId}/comments/${id}/toggleLike`, {
        method: "POST",
    })
}

export function toggleCommentDislike(category, { id, postId }) {
    return makeRequest(`/${category}/posts/${postId}/comments/${id}/toggleDislike`, {
        method: "POST",
    })
}