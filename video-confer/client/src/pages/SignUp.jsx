import React, { useState } from "react";
import { Link } from "react-router-dom";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="relative w-full max-w-md bg-gray-800 px-6 pt-10 pb-8 shadow-xl ring-1 ring-gray-700 sm:rounded-xl sm:px-10">
        <div className="w-full">
          <div className="text-center">
            <h1 className="text-3xl font-semibold text-white">Sign up</h1>
            <p className="mt-2 text-gray-400">
              Create an account to access exclusive features
            </p>
          </div>
          <div className="mt-5">
            <form action="">
              <div className="relative mt-6">
                <input
                  type="text"
                  name="username"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Username"
                  className="pl-8 peer mt-1 w-full border-b-2 border-gray-600 bg-transparent px-0 py-2 text-white placeholder-transparent focus:border-green-500 focus:outline-none"
                  autoComplete="NA"
                />
                <label
                  htmlFor="username"
                  className="pointer-events-none absolute top-0 left-0 origin-left -translate-y-1/2 transform text-sm text-gray-400 transition-all duration-150 ease-in-out peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-0 peer-focus:pl-8 peer-focus:text-sm peer-focus:text-green-500"
                >
                  Username
                </label>
              </div>
              <div className="relative mt-6">
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email Address"
                  className="pl-8 peer mt-1 w-full border-b-2 border-gray-600 bg-transparent px-0 py-2 text-white placeholder-transparent focus:border-blue-500 focus:outline-none"
                  autoComplete="NA"
                />
                <label
                  htmlFor="email"
                  className="pointer-events-none absolute top-0 left-0 origin-left -translate-y-1/2 transform text-sm text-gray-400 transition-all duration-150 ease-in-out peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-0 peer-focus:pl-8 peer-focus:text-sm peer-focus:text-blue-500"
                >
                  Email Address
                </label>
              </div>
              <div className="relative mt-6">
                <input
                  type="password"
                  name="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="pl-8 peer mt-1 w-full border-b-2 border-gray-600 bg-transparent px-0 py-2 text-white placeholder-transparent focus:border-yellow-500 focus:outline-none"
                />
                <label
                  htmlFor="password"
                  className="pointer-events-none absolute top-0 left-0 origin-left -translate-y-1/2 transform text-sm text-gray-400 transition-all duration-150 ease-in-out peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-0 peer-focus:pl-8 peer-focus:text-sm peer-focus:text-yellow-500"
                >
                  Password
                </label>
              </div>
              <div className="my-6">
                <Link to="/Zoom">
                  <button
                    type="submit"
                    className="w-full rounded-md bg-green-600 px-3 py-4 text-white hover:bg-green-700 focus:bg-green-700 focus:outline-none"
                  >
                    Sign up
                  </button>
                </Link>
              </div>
              <p className="text-center text-sm text-gray-400">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-semibold text-blue-400 hover:underline focus:text-blue-500 focus:outline-none"
                >
                  Sign in
                </Link>
                .
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
