import { BrowserRouter, Route, Routes,Navigate  } from "react-router-dom";
import "./App.css";
import Blog from "./Pages/Blog";
import AllBlog from "./Pages/AllBlog";
import Auth from "./Pages/Auth";

function App() {
  const token = localStorage.getItem("token");
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route path="/blog/:id" element={<Blog />} />
          <Route path="/allBlogs" element={<AllBlog />} />
          <Route path="*" element={<Navigate to={token ? "/allBlogs" : "/auth"} />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
