import { useEffect, useState } from "react"
import BlogDiv from "../Components/BlogDiv"
import axios from "axios"

interface BlogProps{
  title: string;
  content: string;
  author: {
    name: string;
  };
}
const Blog = () => {

  const [blogs, setBlogs] = useState<BlogProps[]>([])

  async function GetAllBlogs() {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://127.0.0.1:8787/api/v1/blog/bulk',
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      // console.log(res.data.allBlogs)
      return res.data;
  }


  useEffect(() => {
    const res = GetAllBlogs();
      res.then((data) => {
          setBlogs(data.allBlogs);
      })
  },[]);

  return (
    <div className="w-1/3 mx-auto mt-10 p-5 overflow-y-auto ">
      {blogs.map((blog,i)=> {
        return <BlogDiv key={i} title={blog.title} content={blog.content} authorName={blog.author.name}/>
      })}
    </div>
  )
}

export default Blog