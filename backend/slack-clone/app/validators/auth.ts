import vine from '@vinejs/vine'

const password = vine.string().minLength(8)
const nickname = vine.string().maxLength(50)
const firstname = vine.string().maxLength(50)
const surname = vine.string().minLength(8)
const passwordConfirmation = vine.string().minLength(8)

export const registerValidator = vine.compile(
    vine.object({
        email: vine.string().email().normalizeEmail().unique(async (db, value) => {
            const match = await db.from('users').select('id').where('email', value).first()

            return !match
        }),
        nickname,
        firstname,
        surname,
        password,
        passwordConfirmation
    })
)

export const loginValidator = vine.compile(
    vine.object({
        email: vine.string().email().normalizeEmail(),
        password
    })
)