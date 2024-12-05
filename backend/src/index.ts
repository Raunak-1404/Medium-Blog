import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { decode, sign, verify } from 'hono/jwt'
import userRoute from './Routes/userRoute'
import blogRoute from './Routes/blogRoute'


const app = new Hono<{
  Bindings: {
    DATABASE_URL :string,
    JWT_SECRET: string,
  },
  
}>();

app.route('/api/v1/user/', userRoute );
app.route('/api/v1/blog/', blogRoute );

export default app;
