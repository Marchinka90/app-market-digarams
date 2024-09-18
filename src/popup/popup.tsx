import React, { useState, useEffect } from "react";
import Logout from "./components/Logout";
import Login from "./components/Login";

const Popup = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState("");

  useEffect(() => {
    chrome.storage.session.get(["token"], (sessionResult) => {
      if (sessionResult.token) {
        setToken(sessionResult.token);
        setIsLoggedIn(true);
      } else {
        chrome.storage.sync.get(["token"], (syncResult) => {
          if (syncResult.token) {
            setToken(syncResult.token);
            setIsLoggedIn(true);
          }
        });
      }
    });
  }, []);

  const handleLogin = (token: string) => {
    setToken(token);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setToken("");
    setIsLoggedIn(false);
    chrome.storage.session.remove(["token"]);
    chrome.storage.sync.remove(["token"]);
  };

  return (
    <div className="w-80 p-4 bg-white rounded-lg shadow-md">
      {isLoggedIn ? (
        <Logout onLogout={handleLogout} />
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </div>
  );
};

export default Popup;
