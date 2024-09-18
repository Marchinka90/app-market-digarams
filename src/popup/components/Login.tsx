import React, { useState } from "react";
import { useHttpClient } from "../../shared/hooks/http-hook";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";

interface LoginProps {
  onLogin: (token: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const { isLoading, sendRequest, error, clearError } = useHttpClient();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    sendRequest(
      "http://localhost:3000/api/auth/login",
      "POST",
      JSON.stringify({
        username,
        password,
        rememberMe,
      }),
      {
        "Content-Type": "application/json",
      }
    )
      .then((resData) => {
        onLogin(resData.token);
        if (rememberMe) {
          chrome.storage.sync.set({ token: resData.token }, () => {});
        } else {
          chrome.storage.session.set({ token: resData.token }, () => {});
        }
      })
      .catch((err) => {
        console.log(error);
      });
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      {!isLoading && (
        <form onSubmit={handleSubmit}>
          <h2 className="text-2xl font-semibold mb-6 text-center">Login</h2>
          <div className="mb-4">
            <label htmlFor="username" className="block mb-2">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value.trim())}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value.trim())}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>
          <div className="mb-4 flex items-center">
            <input
              type="checkbox"
              id="rememberMe"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="rememberMe" className="text-sm">
              Remember Me
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
          >
            Login
          </button>
        </form>
      )}
    </>
  );
};

export default Login;
