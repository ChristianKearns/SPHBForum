import fastify from "fastify"
import sensible from "@fastify/sensible"
import cors from "@fastify/cors"
import cookie from "@fastify/cookie"
import dotenv from "dotenv"
import { PrismaClient } from "@prisma/client"

dotenv.config()
const app = fastify()
app.register(sensible)
app.register(cookie, { secret: process.env.COOKIE_SECRET })
app.register(cors, {
    origin: process.env.CLIENT_URL,
    credentials: true,
})
app.addHook("onRequest", (req, res, done) => {
    if (req.cookies.userId !== CURRENT_USER_ID) {
        req.cookies.userId = CURRENT_USER_ID
        res.clearCookie("userId")
        res.setCookie("userId", CURRENT_USER_ID)
    }
    done()
})
const prisma = new PrismaClient()
const CURRENT_USER_ID = (
    await prisma.user.findFirst({ where: { id: "57a17d1b-f1f1-414d-8a10-9ecb67630810" } })
).id

const COMMENT_SELECT_FIELDS = {
    id: true,
    message: true,
    parentId: true,
    createdAt: true,
    user: {
        select: {
            id: true,
            name: true,
            admin: true,
            roles: true,
        },
    },
}

const POST_SELECT_FIELDS = {
    id: true,
    category: true,
    title: true,
    body: true,
    user: {
        select: {
            id: true,
            name: true,
            admin: true,
            roles: true,
            likes: true,
            dislikes: true,
        },
    },
    userId: true,
    createdAt: true,
    likes: true,
    dislikes: true,
}

const USER_SELECT_FIELDS = {
    id: true,
    name: true,
    about: true,
    createdAt: true,
    inbox: true,
    sent: true,
    roles: true,
    admin: true,
}

const PM_SELECT_FIELDS = {
    id: true,
    from: {
        select: {
            id: true,
            name: true,
            roles: true,
        },
    },
    to: {
        select: {
            id: true,
            name: true,
            roles: true,
        },
    },
    title: true,
    message: true,
    fromId: true,
    toId: true,
    createdAt: true,
}

const ROLE_SELECT_FIELDS = {
    id: true,
    name: true,
    color: true,
    users: {
        select: {
            id: true,
            name: true,
            roles: true,
        }
    },
}

const REPORT_SELECT_FIELDS = {
    id: true,
    reason: true,
    reporterId: true,
    reporter: {
        select: {
            name: true,
        },
    },
    createdAt: true,
    reportedPost: {
        select: {
            id: true,
            title: true,
            body: true,
            createdAt: true,
            user: {
                select: {
                    id: true,
                    name: true,
                }
            },
        },
    },
    postId: true,
    reportedComment: {
        select: {
            id: true,
            message: true,
            createdAt: true,
            user: {
                select: {
                    id: true,
                    name: true,
                }
            },
        },
    },
    commentId: true,
}

const FEEDBACK_SELECT_FIELDS = {
    id: true,
    feedback: true,
    createdAt: true,
}

/* --------------------- Login --------------------- */

app.post("/login", async (req, res) => {
    const user = prisma.user.findFirst({
        where: {
            id: req.body.id,
        }
    })

    if (user == null) {
        return await commitToDb(
            prisma.user
                .create({
                    data: {
                        id: req.body.id,
                        name: req.body.name,
                    },
                    select: USER_SELECT_FIELDS,
                })
        )
    }

    return "Success"


})

/* --------------------- Posts --------------------- */

app.get("/:category/posts", async (req, res) => {
    return await commitToDb(
        prisma.post.findMany({
            orderBy: {
                createdAt: "desc",
            },
            where: {
                category: req.params.category,
            },
            select: {
                ...POST_SELECT_FIELDS,
            },
        })
    )
})

app.get("/:category/posts/:id", async (req, res) => {
    return await commitToDb(
        prisma.post
            .findUnique({
                where: { id: req.params.id },
                select: {
                    ...POST_SELECT_FIELDS,
                    _count: {
                        select: {
                            likes: true,
                            dislikes: true,
                        }
                    },
                    comments: {
                        orderBy: {
                            createdAt: "desc",
                        },
                        select: {
                            ...COMMENT_SELECT_FIELDS,
                            _count: {
                                select: {
                                    likes: true,
                                    dislikes: true,
                                }
                            },
                        },
                    },
                },
            })
            .then(async post => {
                const likes = await prisma.like.findMany({
                    where: {
                        userId: req.body.currentUserId,
                        commentId: { in: post.comments.map(comment => comment.id) },
                    },
                })

                const dislikes = await prisma.dislike.findMany({
                    where: {
                        userId: req.body.currentUserId,
                        commentId: { in: post.comments.map(comment => comment.id) },
                    },
                })

                return {
                    ...post,
                    upvoted: post.likes.find(like => like.postId === post.id),
                    downvoted: post.dislikes.find(dislike => dislike.postId === post.id),
                    numLikes: post._count.likes,
                    numDislikes: post._count.dislikes,
                    comments: post.comments.map(comment => {
                        const { _count, ...commentFields } = comment
                        return {
                            ...commentFields,
                            upvotedByMe: likes.find(like => like.commentId === comment.id),
                            likeCount: _count.likes,
                            downvotedByMe: dislikes.find(dislike => dislike.commentId === comment.id),
                            dislikeCount: _count.dislikes,
                        }
                    }),
                }
            })
    )
})

app.post("/:category/posts", async (req, res) => {
    if (req.body.postTitle === "" || req.body.postTitle == null) {
        return res.send(app.httpErrors.badRequest("Title is required"))
    }

    if (req.body.message === "" || req.body.message == null) {
        return res.send(app.httpErrors.badRequest("Message is required"))
    }

    return await commitToDb(
        prisma.post
            .create({
                data: {
                    title: req.body.postTitle,
                    category: req.params.category,
                    body: req.body.message,
                    userId: req.body.currentUserId,
                },
                select: POST_SELECT_FIELDS,
            })
            .then(post => {
                return {
                    ...post,
                    numLikes: 0,
                    numDislikes: 0,
                    upvoted: false,
                    downvoted: false,
                }
            })
    )
})

app.put("/:category/posts/:postId", async (req, res) => {
    if (req.body.message === "" || req.body.message == null) {
        return res.send(app.httpErrors.badRequest("Message is required"))
    }

    const { userId } = await prisma.post.findUnique({
        where: { id: req.params.postId },
        select: { userId: true },
    })
    if (userId !== req.body.currentUserId) {
        const { admin } = await prisma.user.findUnique({
            where: { id: req.body.currentUserId },
            select: { admin: true },
        })

        if (!admin) {
            return res.send(
                app.httpErrors.unauthorized(
                    "You do not have permission to edit this message"
                )
            )
        }
    }

    return await commitToDb(
        prisma.post.update({
            where: { id: req.params.postId },
            data: { body: req.body.message },
            select: { body: true },
        })
    )
})

app.delete("/:category/posts/:postId", async (req, res) => {
    const { userId } = await prisma.post.findUnique({
        where: { id: req.params.postId },
        select: { userId: true },
    })
    if (userId !== req.body.currentUserId) {
        const { admin } = await prisma.user.findUnique({
            where: { id: req.body.currentUserId },
            select: { admin: true },
        })

        if (!admin) {
            return res.send(
                app.httpErrors.unauthorized(
                    "You do not have permission to edit this message"
                )
            )
        }
    }

    return await commitToDb(
        prisma.post.delete({
            where: { id: req.params.postId },
            select: { id: true },
        })
    )
})

app.post("/:category/posts/:postId/toggleLike", async (req, res) => {
    const data = {
        postId: req.params.postId,
        userId: req.body.currentUserId,
    }

    const like = await prisma.like.findUnique({
        where: { userId_postId: data },
    })

    if (like == null) {
        return await commitToDb(
            prisma.like.create({ data })
        ).then(() => {
            return { addLike: true }
        })
    } else {
        return await commitToDb(
            prisma.like.delete({ where: { userId_postId: data } })
        ).then(() => {
            return { addLike: false }
        })
    }
})

app.post("/:category/posts/:postId/toggleDislike", async (req, res) => {
    const data = {
        postId: req.params.postId,
        userId: req.body.currentUserId,
    }

    const dislike = await prisma.dislike.findUnique({
        where: { userId_postId: data },
    })

    if (dislike == null) {
        return await commitToDb(
            prisma.dislike.create({ data })
        ).then(() => {
            return { addDislike: true }
        })
    } else {
        return await commitToDb(
            prisma.dislike.delete({ where: { userId_postId: data } })
        ).then(() => {
            return { addDislike: false }
        })
    }
})

/* --------------------- Comments --------------------- */

app.post("/:category/posts/:id/comments", async (req, res) => {
    if (req.body.message === "" || req.body.message == null) {
        return res.send(app.httpErrors.badRequest("Message is required"))
    }

    return await commitToDb(
        prisma.comment
            .create({
                data: {
                    message: req.body.message,
                    userId: req.cookies.userId,
                    parentId: req.body.parentId,
                    postId: req.params.id,
                },
                select: COMMENT_SELECT_FIELDS,
            })
            .then(comment => {
                return {
                    ...comment,
                    likeCount: 0,
                    dislikeCount: 0,
                    upvotedByMe: false,
                    downvotedByMe: false,
                }
            })
    )
})

app.put("/:category/posts/:postId/comments/:commentId", async (req, res) => {
    if (req.body.message === "" || req.body.message == null) {
        return res.send(app.httpErrors.badRequest("Message is required"))
    }

    const { userId } = await prisma.comment.findUnique({
        where: { id: req.params.commentId },
        select: { userId: true },
    })
    if (userId !== req.cookies.userId) {
        const { admin } = await prisma.user.findUnique({
            where: { id: req.cookies.userId },
            select: { admin: true },
        })

        if (!admin) {
            return res.send(
                app.httpErrors.unauthorized(
                    "You do not have permission to edit this message"
                )
            )
        }
    }

    return await commitToDb(
        prisma.comment.update({
            where: { id: req.params.commentId },
            data: { message: req.body.message },
            select: { message: true },
        })
    )
})

app.delete("/:category/posts/:postId/comments/:commentId", async (req, res) => {
    const { userId } = await prisma.comment.findUnique({
        where: { id: req.params.commentId },
        select: { userId: true },
    })
    if (userId !== req.cookies.userId) {
        const { admin } = await prisma.user.findUnique({
            where: { id: req.cookies.userId },
            select: { admin: true },
        })

        if (!admin) {
            return res.send(
                app.httpErrors.unauthorized(
                    "You do not have permission to edit this message"
                )
            )
        }
    }

    return await commitToDb(
        prisma.comment.delete({
            where: { id: req.params.commentId },
            select: { id: true },
        })
    )
})

app.post("/:category/posts/:postId/comments/:commentId/toggleLike", async (req, res) => {
    const data = {
        commentId: req.params.commentId,
        userId: req.cookies.userId,
    }

    const like = await prisma.like.findUnique({
        where: { userId_commentId: data },
    })

    if (like == null) {
        return await commitToDb(
            prisma.like.create({ data })
        ).then(() => {
            return { addLike: true }
        })
    } else {
        return await commitToDb(
            prisma.like.delete({ where: { userId_commentId: data } })
        ).then(() => {
            return { addLike: false }
        })
    }
})

app.post("/:category/posts/:postId/comments/:commentId/toggleDislike", async (req, res) => {
    const data = {
        commentId: req.params.commentId,
        userId: req.cookies.userId,
    }

    const dislike = await prisma.dislike.findUnique({
        where: { userId_commentId: data },
    })

    if (dislike == null) {
        return await commitToDb(
            prisma.dislike.create({ data })
        ).then(() => {
            return { addDislike: true }
        })
    } else {
        return await commitToDb(
            prisma.dislike.delete({ where: { userId_commentId: data } })
        ).then(() => {
            return { addDislike: false }
        })
    }
})

/* --------------------- User Profiles --------------------- */

app.get("/profiles/user", async (req, res) => {
    return await commitToDb(
        prisma.user.findMany({
            orderBy: {
                name: "asc",
            },
            select: {
                ...USER_SELECT_FIELDS,
            },
        })
    )
})

app.get("/profiles/user/:name", async (req, res) => {
    return await commitToDb(
        prisma.user
            .findFirst({
                where: { name: req.params.name },
                select: {
                    ...USER_SELECT_FIELDS,
                    posts: {
                        orderBy: {
                            createdAt: "desc",
                        },
                    },
                    comments: {
                        orderBy: {
                            createdAt: "desc",
                        },
                        select: {
                            ...COMMENT_SELECT_FIELDS,
                        },
                    },
                    _count: {
                        select: {
                            likes: true,
                            dislikes: true
                        }
                    },
                },
            })
    )
})

app.put("/profiles/user/:name", async (req, res) => {
    if (req.body.about === "" || req.body.about == null) {
        return res.send(app.httpErrors.badRequest("About Field is required"))
    }

    const { id } = await prisma.user.findUnique({
        where: { name: req.params.name },
        select: { id: true },
    })
    if (id !== req.cookies.userId) {
        const { admin } = await prisma.user.findUnique({
            where: { id: req.cookies.userId },
            select: { admin: true },
        })

        if (!admin) {
            return res.send(
                app.httpErrors.unauthorized(
                    "You do not have permission to edit this message"
                )
            )
        }
    }

    return await commitToDb(
        prisma.user.update({
            where: { id: id },
            data: { about: req.body.about },
            select: { about: true },
        })
    )
})

app.post("/profiles/user", async (req, res) => {
    return await commitToDb(
        prisma.user
            .create({
                data: {
                    name: req.body.name,
                },
            })
    )
})

/* --------------------- Private Messages --------------------- */
app.get("/profiles/user/pms/inbox", async (req, res) => {
    return await commitToDb(
        prisma.user.findFirst({
            where: { id: req.cookies.userId },
            select: {
                id: true,
                name: true,
                sent: {
                    orderBy: {
                        createdAt: "desc",
                    },
                    select: {
                        ...PM_SELECT_FIELDS,
                    },
                },
                inbox: {
                    orderBy: {
                        createdAt: "desc",
                    },
                    select: {
                        ...PM_SELECT_FIELDS,
                    },
                },
            },
        })
    )
})

app.get("/profiles/user/pms/sent", async (req, res) => {
    return await commitToDb(
        prisma.user.findFirst({
            where: { id: req.cookies.userId },
            select: {
                sent: {
                    orderBy: {
                        createdAt: "desc",
                    },
                    select: {
                        ...PM_SELECT_FIELDS,
                    },
                },
            },
        })
    )
})

app.get("/profiles/user/pms/inbox/:id", async (req, res) => {
    return await commitToDb(
        prisma.pm.findFirst({
            where: { id: req.params.id },
            select: PM_SELECT_FIELDS,
        })
    )
})

app.post("/profiles/user/pms/new-pm", async (req, res) => {

    // Error checking
    if (req.body.to === "" || req.body.to == null) {
        return res.send(app.httpErrors.badRequest("Recipient is required"))
    }

    if (req.body.title === "" || req.body.title == null) {
        return res.send(app.httpErrors.badRequest("Title is required"))
    }

    if (req.body.message === "" || req.body.message == null) {
        return res.send(app.httpErrors.badRequest("Message is required"))
    }


    return await commitToDb(
        prisma.pm.create({
            data: {
                fromId: req.cookies.userId,
                toId: req.body.to,
                title: req.body.title,
                message: req.body.message,
            },
            select: PM_SELECT_FIELDS,
        })
    )
})

app.delete("/profiles/user/pms/inbox/:id", async (req, res) => {
    const fromUserId = (await prisma.pm.findFirst({
        where: { id: req.params.id }
    })).fromId

    if (fromUserId === req.cookies.userId) {
        return await commitToDb(
            prisma.pm.delete({
                where: { id: req.params.id },
                select: { id: true, },
            })
        )
    }
    else {
        return await commitToDb(
            prisma.pm.update({
                where: { id: req.params.id },
                data: {
                    toId: null
                },
            }))
    }
})

/* --------------------- Roles --------------------- */

app.get("/admin", async (req, res) => {
    return await commitToDb(
        prisma.role.findMany({
            select: {
                id: true,
                users: {
                    select: {
                        id: true,
                        name: true,
                        roles: true,
                    },
                },
                name: true,
                color: true,
            },
        })
    )
})

app.put("/admin", async (req, res) => {
    // Error checking
    if (req.body.userId === "" || req.body.userId == null) {
        return res.send(app.httpErrors.badRequest("User is required"))
    }

    if (req.body.roleId === "" || req.body.roleId == null) {
        return res.send(app.httpErrors.badRequest("Role is required"))
    }

    const data = {
        userId: req.body.userId,
        roleId: req.body.roleId,
    }

    return await commitToDb(
        prisma.user.update({
            where: { id: data.userId },
            data: {
                roles: {
                    connect: { id: data.roleId }
                }
            },
        })
    )
})

app.delete("/admin", async (req, res) => {
    return await commitToDb(
        prisma.role.delete({
            where: {
                id: req.body.roleId,
            }
        })
    )
})

app.post("/admin/new-role", async (req, res) => {
    // Error checking
    if (req.body.color.length > 6) {
        return res.send(app.httpErrors.badRequest("Please make the color hex code 6 digits or less! Do not include a # at the beginning."))
    }

    if (!(/^[A-Za-z0-9]*$/.test(req.body.color))) {
        return res.send(app.httpErrors.badRequest("Please exclusively fill in the color hex code field with numbers and letter."))
    }

    return await commitToDb(
        prisma.role.create({
            data: {
                name: req.body.name,
                color: req.body.color,
            },
            select: ROLE_SELECT_FIELDS,
        })
    )
})

/* --------------------- Reports --------------------- */

app.get("/admin/reports", async (req, res) => {
    return await commitToDb(
        prisma.report.findMany({
            orderBy: {
                createdAt: "desc",
            },
            where: {
                isPost: true,
            },
            select: {
                ...REPORT_SELECT_FIELDS,
            },
        })
    )
})

app.get("/admin/comment-reports", async (req, res) => {
    return await commitToDb(
        prisma.report.findMany({
            where: {
                isPost: false,
            },
            select: {
                ...REPORT_SELECT_FIELDS,
            },
        })
    )
})

app.get("/admin/reports/:id", async (req, res) => {
    return await commitToDb(
        prisma.report.findFirst({
            where: { id: req.params.id },
            select: {
                ...REPORT_SELECT_FIELDS,
            },
        })
    )
})

app.post("/admin/create-report", async (req, res) => {
    return await commitToDb(
        prisma.report.create({
            data: {
                postId: req.body.postId,
                reason: req.body.reason,
                reporterId: req.cookies.userId,
                isPost: req.body.isPost,
            },
            select: {
                ...REPORT_SELECT_FIELDS,
            }
        })
    )
})

app.post("/admin/create-comment-report", async (req, res) => {
    return await commitToDb(
        prisma.report.create({
            data: {
                commentId: req.body.commentId,
                reason: req.body.reason,
                reporterId: req.cookies.userId,
                isPost: req.body.isPost,
            },
            select: {
                ...REPORT_SELECT_FIELDS,
            }
        })
    )
})

app.delete(`/admin/reports/:id`, async (req, res) => {
    return await commitToDb(
        prisma.report.delete({
            where: { id: req.params.id },
            select: { id: true },
        })
    )
})

/* --------------------- Feedback --------------------- */

app.get("/admin/feedback", async (req, res) => {
    return await commitToDb(
        prisma.feedback.findMany({
            orderBy: {
                createdAt: "desc",
            },
            select: {
                ...FEEDBACK_SELECT_FIELDS,
            },
        })
    )
})

app.post("/admin/create-feedback", async (req, res) => {
    return await commitToDb(
        prisma.feedback.create({
            data: {
                feedback: req.body.feedback,
            },
            select: {
                ...FEEDBACK_SELECT_FIELDS,
            }
        })
    )
})

app.delete(`/admin/feedback/:id`, async (req, res) => {
    return await commitToDb(
        prisma.feedback.delete({
            where: { id: req.params.id },
            select: { id: true },
        })
    )
})

/* --------------------- commitToDb & app.listen --------------------- */

async function commitToDb(promise) {
    const [error, data] = await app.to(promise)
    if (error) return app.httpErrors.internalServerError(error.message)
    return data
}

app.listen({ port: process.env.PORT })