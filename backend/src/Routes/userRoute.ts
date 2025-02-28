import { Hono } from "hono";
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import {  sign, verify } from 'hono/jwt'
import { signupSchema, loginSchema } from "@jijotiaraunak14/medium-common3";

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
    console.log(body)
    
    try {
      const { success } = signupSchema.safeParse(body);

      if(!success){
        return c.json({
          status: 403,
          msg: "Invalid input",
          error: signupSchema.safeParse(body).error
        });
      }
      
      const existantUser = await prisma.user.findFirst({
        where :{
          email: body.email,
        }
      });
  
      if(existantUser){
        return c.json({
          msg: "User already exist",
          status: 403
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
      localStorage.setItem('token', token);

      return c.json({
        status: 200,
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
      const { success } = loginSchema.safeParse(body);
      const Ltoken =  c.req.header('Authorization') || " " ;

      if(!success){
        return c.json({
          status: 403,
          msg: "Invalid input",
          error: loginSchema.safeParse(body).error
        });
      }
      
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
  
      // const token = await sign({userid:user.id}, c.env.JWT_SECRET);\
      const token = await verify(Ltoken, c.env.JWT_SECRET);
      if(!token){
        return c.json({
          status: 403,
          msg: "Invalid token"
        });
      }
      return c.json({ 
        status: 200,
        token,
        user
       });
  
    } catch (error) {
      return c.json({
        status: 403,
        msg: "Error while signin",
        error
      });
    }
  
  
  })


export default userRoute;