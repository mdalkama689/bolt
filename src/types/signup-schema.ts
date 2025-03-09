import {z} from 'zod'

const signUpSchema = z.object({
    fullName: z.string().min(5, "Full name must be at least 5 characters").max(30, 'Full name should not exceed 30 characters'),
    email: z.string().email('Invalid email format'),
    password: z.string().min(6, 'Password length must be at least 6 characters')
})


export default signUpSchema
