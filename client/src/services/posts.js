import { makeRequest } from "./makeRequest";

export function getPosts(category) {
    return makeRequest(`/${category}/posts`)
}

export function getPost(category, id, { currentUserId }) {
    return makeRequest(`/${category}/posts/${id}`)
}

export function createPost(category, { currentUserId, message, postTitle }) {
    return makeRequest(`/${category}/posts`, {
        method: "POST",
        data: { message, postTitle }
    })
}

export function updatePost(category, id, { currentUserId, message }) {
    return makeRequest(`/${category}/posts/${id}`, {
        method: "PUT",
        data: { message },
    })
}

export function deletePost(category, id, { currentUserId }) {
    return makeRequest(`/${category}/posts/${id}`, {
        method: "DELETE",
    })
}

export function togglePostLike(category, id, { currentUserId }) {
    return makeRequest(`/${category}/posts/${id}/toggleLike`, {
        method: "POST",
    })
}

export function togglePostDislike(category, id, { currentUserId }) {
    return makeRequest(`/${category}/posts/${id}/toggleDislike`, {
        method: "POST",
    })
}
