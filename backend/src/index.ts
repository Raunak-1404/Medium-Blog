import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { decode, sign, verify } from 'hono/jwt'

const app = new Hono<{
  Bindings: {
    DATABASE_URL :string,
    JWT_SECRET: string,
  },
  
}>();

app.use('/api/v1/blog/*', async (c,next)=> {
  const token = c.req.header("Authorization") || "";
  const header = token.split(" ")[1];
  const res = await verify(header, c.env.JWT_SECRET);
  console.log(res)
  if(res.userid) {
    c.set("jwtPayload", { userid: res.id });
    await next();
  }
  else {
    return c.json({ msg: "Invalid token" }, 403);
  }
})

app.post('/api/v1/user/signup', async(c) => {
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

app.post('/api/v1/user/signin', async (c)=> {

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

app.post('/api/v1/blog',(c)=> {
  return c.text("blog endpoint");
})

app.put('/api/v1/blog',(c)=> {
  return c.text("update Blog endpoint");
})

app.get('/api/v1/blog/:id',(c)=> {
  return c.text("get Blog endpoint based on id");
})

app.get('/api/v1/blog/bulk',(c)=> {
  return c.text("get Blog endpoint bulk");
})

export default app

// DATABASE_URL="prisma://accelerate.prisma-data.net/?api_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlfa2V5IjoiNjdlZmQ3ZTYtN2Q5Yi00MDQ2LTk2MDUtMWNjMjAzZWY1ZThjIiwidGVuYW50X2lkIjoiOGQ3NGE3ZjcxMzYxMmVkZWMyZTI5Y2Q0OTk2YTk2MDVhNzI1NmQ0MjVhNmUyYmM3ZTgxMThjOGRiMzliYjE1NyIsImludGVybmFsX3NlY3JldCI6IjkzYzc4MDZhLWE1NzUtNGZlOS05OGI4LTcxNjE3ZTlmNjJjYyJ9.p9LYYOV7TSVrp_vvXSynOYoy3Q9wNthtUPMixWIyUTs"