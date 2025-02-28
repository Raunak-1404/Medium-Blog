
import { useState } from 'react';
// import { Link } from 'react-router-dom'

const Signupp = () => {
  const [isSignup, setIsSignup] = useState(true);

  const toggleForm = () => setIsSignup(!isSignup);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">
          {isSignup ? 'Signup' : 'Login'} Form
        </h2>

        <form>
          {isSignup && (
            <div className="mb-4">
              <label className="block mb-1 font-medium">Username</label>
              <input
                type="text"
                placeholder="Enter your username"
                className="w-full p-2 border rounded-lg"
              />
            </div>
          )}

          <div className="mb-4">
            <label className="block mb-1 font-medium">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full p-2 border rounded-lg"
            />
          </div>

          <div className="mb-6">
            <label className="block mb-1 font-medium">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              className="w-full p-2 border rounded-lg"
            />
          </div>

          <button
            type="submit"
            className="w-full p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            {isSignup ? 'Signup' : 'Login'}
          </button>
        </form>

        <p className="mt-4 text-center">
          {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            onClick={toggleForm}
            className="text-blue-500 hover:underline"
          >
            {isSignup ? 'Login' : 'Signup'}
          </button>
        </p>
      </div>
    </div>
  );
}

export default Signupp