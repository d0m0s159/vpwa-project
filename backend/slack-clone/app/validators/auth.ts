import vine from '@vinejs/vine'

const password = vine.string()
const nickname = vine.string()
const firstname = vine.string()
const surname = vine.string()

export const registerValidator = vine.compile(
    vine.object({
        email: vine.string().email().normalizeEmail().unique(async (db, value) => {
            const match = await db.from('users').select('id').where('email', value).first()
            return !match
        }),
        nickname,
        firstname,
        surname,
        password
    })
)

export const loginValidator = vine.compile(
    vine.object({
        email: vine.string().email().normalizeEmail(),
        password
    })
)