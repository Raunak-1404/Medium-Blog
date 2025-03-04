import { useState } from "react";
// import { Link } from 'react-router-dom'
import { SignUPInput } from "@jijotiaraunak14/medium-common3";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Signupp = () => {
  const [isSignup, setIsSignup] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const toggleForm = () => setIsSignup(!isSignup);

  const navigate = useNavigate();
  async function sendRequest() {
    const data: SignUPInput = { email, name, password };
    
    try {
      if (isSignup) {
        const res = await axios.post(
          "http://127.0.0.1:8787/api/v1/user/signup",
          data
        );
        console.log(res.data);
        if (res.data.status === 200) {
          localStorage.setItem("token", res.data.token);
          navigate("/allBlogs");
        } else {
          navigate("/auth");
        }
      } else {
        const token = localStorage.getItem("token");
        const res = await axios.post(
          "http://127.0.0.1:8787/api/v1/user/signin",
          data,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(res)
        if (res.data.status === 200) {
          navigate("/allBlogs");
        } else {
          navigate("/auth");
        }
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">
          {isSignup ? "Signup" : "Login"}
        </h2>

        {/* <form> */}
          {isSignup && (
            <div className="mb-4">
              <label className="block mb-1 font-medium">Username</label>
              <input
                type="text"
                placeholder="Enter your username"
                className="w-full p-2 border rounded-lg"
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          )}

          <div className="mb-4">
            <label className="block mb-1 font-medium">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full p-2 border rounded-lg"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="mb-6">
            <label className="block mb-1 font-medium">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              className="w-full p-2 border rounded-lg"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            
            className="w-full p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            onClick={sendRequest}
          >
            {isSignup ? "Signup" : "Login"}
          </button>
        {/* </form> */}

        <p className="mt-4 text-center">
          {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
          <button
            onClick={toggleForm}
            className="text-blue-500 hover:underline"
          >
            {isSignup ? "Login" : "Signup"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Signupp;
