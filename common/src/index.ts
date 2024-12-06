import zod from 'zod';

export const signupSchema = zod.object({
    email : zod.string().email(),
    password : zod.string(),
    name: zod.string().optional()
});


export const loginSchema = zod.object({
    email: zod.string().email(),
    password: zod.string().min(6)
});


export const createBlog = zod.object({
    title: zod.string(),
    content: zod.string()
})


export const UpdateBlog = zod.object({
    title: zod.string(),
    content: zod.string(),
    id: zod.number()
})


export type SignUPInput = zod.infer<typeof signupSchema>;
export type LoginInput = zod.infer<typeof loginSchema>;
export type CreateBlogInput = zod.infer<typeof createBlog>;
export type updateBlogInput = zod.infer<typeof UpdateBlog>;