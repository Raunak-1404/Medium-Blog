import { Hono } from "hono";
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { decode, sign, verify } from 'hono/jwt'

const userRoute = new Hono<{
    Bindings: {
        DATABASE_URL: string,
        JWT_SECRET: string,
    }
}>()

userRoute.post('/signup', async(c) => {
    const prisma = new PrismaClient({
      datasourceUrl:c.env.DATABASE_URL,
    }).$extends(withAccelerate());
  
    const body = await c.req.json();
    try {
  
      const existantUser = await prisma.user.findFirst({
        where :{
          email: body.email,
        },
        select: {
          email:true
        }
      });
  
      if(existantUser){
        return c.json({
          msg: "User already exist"
        });
      }
  
      const user = await prisma.user.create({
        data: {
          email : body.email,
          password: body.password,
          name: body.name,
        }
      });
  
      const token = await sign({userid:user.id}, c.env.JWT_SECRET);
      return c.json({
        token,
        user
      });
  
    } catch (error) {
      return c.status(403);
    }
  })
  
  userRoute.post('/signin', async (c)=> {
  
    const prisma = new PrismaClient({
      datasourceUrl:c.env.DATABASE_URL,
    }).$extends(withAccelerate());
  
    const body = await c.req.json();
    try {
      
      const user = await prisma.user.findUnique({
        where:{
          email: body.email,
        }
      });
  
      if(!user){
        return c.json({
          status: 403,
          msg: "User not found"
        });
      }
  
      const token = await sign({userid:user.id}, c.env.JWT_SECRET);
      return c.json({ 
        token,
        user
       });
  
    } catch (error) {
      return c.json({
        msg: "Error while signin",
        error
      });
    }
  
  
  })


export default userRoute;