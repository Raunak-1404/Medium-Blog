import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { verify } from "hono/jwt";

const blogRoute = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
}>();

blogRoute.use("/*", async (c, next) => {
  const header = c.req.header("Authorization") || "";
  const token = header.split(" ")[1];
  const res = await verify(token, c.env.JWT_SECRET);
  if (res) {
    console.log(res.userid)
    c.set('jwtPayload', res.userid);
    await next();
  } else {
    return c.json({ msg: "Invalid token" }, 403);
  }
});

blogRoute.post("/", async(c) => {
    const prisma = new PrismaClient({
        datasourceUrl:c.env.DATABASE_URL,
      }).$extends(withAccelerate());
    
      const body = await c.req.json();
      try {
        const blogCreated = await prisma.blog.create({
            data: {
                title: body.title,
                content: body.content,
                authorid: Number(c.get("jwtPayload"))
            }
        })

        return c.json({
            msg: "Post created",
            blogCreated
        });
      } catch (error) {
         c.status(403);
         return c.json({
            msg: "Error creating post",
            error
         });
      }
});

blogRoute.put("/", async(c) => {
    const prisma = new PrismaClient({
        datasourceUrl:c.env.DATABASE_URL,
      }).$extends(withAccelerate());
    
      const body = await c.req.json();
      try {
        const {title, content} = body;
        const blogCreated = await prisma.blog.update({
            where: {
                id: body.id
            },
            data: {
                title,
                content,
            }
        })

        return c.json({
            msg: "Post created",
            blogCreated
        });
      } catch (error) {
         c.status(403);
         return c.json({
            msg: "Error creating post"
         });
      }
});

// TODO: Add Pagination
blogRoute.get("/bulk", async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl:c.env.DATABASE_URL,
      }).$extends(withAccelerate());    
        try {
            const allBlogs = await prisma.blog.findMany({
              include:{
                author: true
              }
            });
            // console.log(allBlogs)
            return c.json({
                msg: "Post fetched",
                allBlogs
            });
        } catch (error) {
             c.status(403);
             return c.json({
                msg: "Error fetching post",
                error
             });
        }
});

blogRoute.get("/:id", async(c) => {
    const prisma = new PrismaClient({
        datasourceUrl:c.env.DATABASE_URL,
      }).$extends(withAccelerate());
    
      const id = c.req.param("id");
        try {
            const blog = await prisma.blog.findFirst({
                where: {
                    id : Number(id)
                }
            })
    
            return c.json({
                msg: "Post fetched",
                blog
            });
        } catch (error) {
             c.status(403);
             return c.json({
                msg: "Error fetching post"
             });
        }
});

blogRoute.delete('/', async(c)=> {
    const prisma = new PrismaClient({
        datasourceUrl:c.env.DATABASE_URL,
      }).$extends(withAccelerate());

      try {
        const deleteBlog = await prisma.blog.deleteMany();
        return c.json({
            msg: "All post deleted",
            deleteBlog
        });
      } catch (error) {
            c.status(403);
            return c.json({
                msg: "Error deleting post"
            });
      }
})


export default blogRoute;
